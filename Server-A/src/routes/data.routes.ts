import { Router } from 'express';
import { getDataByAuthNumber, postData } from '../controllers/data.controller';

const router = Router();

router.post('/', postData);
router.get('/:authNumber', getDataByAuthNumber);

export default router;
