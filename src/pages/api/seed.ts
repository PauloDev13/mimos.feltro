import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../utils/db';
import Product from '../../model/Product';
import User from '../../model/User';
import data from '../../utils/data';

const handler = nc();

// Insere no database mongodb os registros do arquivo 'data'
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnected();
  res.send({ message: 'Seed successfully' });
});
export default handler;