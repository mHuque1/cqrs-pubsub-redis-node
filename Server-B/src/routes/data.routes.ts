import { Router } from 'express';
import { getAllRecords } from '../controllers/data.controller';

const router = Router();

router.get('/', getAllRecords);

export default router;
