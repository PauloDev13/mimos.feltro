import nc from 'next-connect';
import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../utils/db';
import Product from '../../model/Product';
import data from '../../utils/data';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnected();
  res.send({message: 'Seed successfully'});
});
export default handler;