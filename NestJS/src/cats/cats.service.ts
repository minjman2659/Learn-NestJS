import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { Cat } from 'src/schema/cats.schema';
import { CatRequestDto } from './dto/cats.request.dto';
import { CatsRepository } from './repository/cats.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CatsService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor(
    private readonly catsRepository: CatsRepository,
    private readonly configService: ConfigService,
  ) {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'), // process.env.AWS_S3_ACCESS_KEY
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      region: this.configService.get('AWS_S3_REGION'),
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME'); // nest-s3
  }

  async register(body: CatRequestDto) {
    const { email, name, password } = body;

    const isExist = await this.catsRepository.existsByEmail(email);
    if (isExist) {
      // 409 코드를 응답하는 클래스
      throw new ConflictException('이미 존재하는 고양이 입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }

  logout() {
    return { token: null };
  }

  async uploadImgInLocal(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `${files[0].filename}`;
    const newCat = await this.catsRepository.findByIdAndUpdateImgInLocal(
      cat.id,
      fileName,
    );

    return newCat;
  }

  async getAllCats() {
    const cats = await this.catsRepository.findAllCats();
    const readOnlyCats = cats.map(cat => cat.readOnlyData);
    return readOnlyCats;
  }

  async uploadFileToS3(folder: string, file: Express.Multer.File, cat: Cat) {
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();

      const newCat = await this.catsRepository.findByIdAndUpdateImgInAws(
        cat.id,
        key,
        this.S3_BUCKET_NAME,
      );
      return newCat;
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  public getAwsS3FileUrl(key: string) {
    return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }
}
