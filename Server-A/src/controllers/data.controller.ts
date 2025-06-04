import { Request, Response } from 'express';

export const postData = async (req: Request, res: Response) => {
  // TODO: Save to MySQL, send to queue, cache it
  res.status(201).send({ message: 'Data received' });
};

export const getDataByAuthNumber = async (req: Request, res: Response) => {
  const { authNumber } = req.params;
  // TODO: Try cache, then DB
  res.send({ authNumber, data: '...' });
};
