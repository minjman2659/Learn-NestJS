import { Router } from 'express';
import {
  createCat,
  readCatList,
  readCat,
  updateAllCat,
  updateCat,
  deleteCat,
} from './cats.service';

const router = Router();

router.post('/cats', createCat);
router.get('/cats', readCatList);
router.get('/cats/:catId', readCat);
router.put('/cats/:catId', updateAllCat);
router.patch('/cats/:catId', updateCat);
router.delete('/cats/:catId', deleteCat);

export default router;
