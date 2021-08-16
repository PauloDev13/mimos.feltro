import nc from 'next-connect';
import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../../utils/db';
import Product from '../../../model/Product';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnected();
  res.send(product);
});
export default handler;