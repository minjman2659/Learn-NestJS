import { Request, Response, NextFunction } from 'express';
import { CatType, Cats } from './cats.model';

//* CREATE 고양이 데이터 생성
export const createCat = (req: Request, res: Response, next: NextFunction) => {
  const body: CatType = req.body;

  try {
    const newCat = {
      id: 'newCatId',
      ...body,
    };
    Cats.push(newCat);
    res.sendStatus(201);
  } catch (err: any) {
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};

//* READ 고양이 데이터 리스트 조회
export const readCatList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // throw new Error('Error!!!!!!!');
    res.status(200).send({
      success: true,
      catList: Cats,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};

//* READ 고양이 데이터 상세 조회
export const readCat = (req: Request, res: Response, next: NextFunction) => {
  const { catId } = req.params;

  try {
    const existedCat = Cats.find((cat) => cat.id === catId);
    res.status(200).send({
      success: true,
      cat: existedCat,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};

//* UPDATE 고양이 데이터 전체 수정
export const updateAllCat = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { catId } = req.params;
  const body: CatType = req.body;

  try {
    Cats.forEach((cat) => {
      if (cat.id === catId) {
        cat = body;
      }
    });
    res.sendStatus(200);
  } catch (err: any) {
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};

//* UPDATE 고양이 데이터 부분 수정
export const updateCat = (req: Request, res: Response, next: NextFunction) => {
  const { catId } = req.params;
  const body: CatType = req.body;

  try {
    Cats.forEach((cat) => {
      if (cat.id === catId) {
        cat = { ...cat, ...body };
      }
    });
    res.sendStatus(200);
  } catch (err: any) {
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};

//* DELETE 고양이 데이터 삭제
export const deleteCat = (req: Request, res: Response, next: NextFunction) => {
  const { catId } = req.params;

  try {
    const deletedCatIdx = Cats.findIndex((cat) => cat.id === catId);
    Cats.splice(deletedCatIdx, 1);
    res.sendStatus(200);
  } catch (err: any) {
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};
