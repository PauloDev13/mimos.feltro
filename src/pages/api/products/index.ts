import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../utils/db';
import Product from '../../../model/Product';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os produtos no database mongodb
  const products = await Product.find({});
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna a lista de produtos
  res.send(products);
});
export default handler;