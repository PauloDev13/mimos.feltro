import { NextApiRequest, NextApiResponse } from 'next';
import db from './db';

export const getError = (err: any) => {
  return err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;
};

export const onError = async (
  err: any,
  req: NextApiRequest,
  res: NextApiResponse,
  next: any,
) => {
  await db.disconnected();
  res.status(500).send({ message: err.toString() });
};