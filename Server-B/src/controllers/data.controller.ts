import { Request, Response } from 'express';
import Record from '../models/record.model';

export const getAllRecords = async (_req: Request, res: Response) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    console.error('Failed to fetch records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
