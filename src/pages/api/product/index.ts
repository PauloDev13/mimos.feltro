import nc from 'next-connect';
import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../../utils/db';
import Product from '../../../model/Product';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnected();
  res.send(products);
});
export default handler;