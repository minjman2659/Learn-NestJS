import * as multer from 'multer';
import * as path from 'path';
import { imagesDir } from './images-dir';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const storage = (): multer.StorageEngine => {
  return multer.diskStorage({
    destination(req, file, cb) {
      //* 어디에 저장할 지
      const folderName = imagesDir;
      cb(null, folderName);
    },

    filename(req, file, cb) {
      //* 어떤 이름으로 올릴 지
      const ext = path.extname(file.originalname);
      const fileName = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;
      cb(null, fileName);
    },
  });
};

export const multerOptions = () => {
  const result: MulterOptions = {
    storage: storage(),
  };

  return result;
};
