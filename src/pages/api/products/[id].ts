import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../utils/db';
import Product from '../../../model/Product';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // procura por um produto com o ID informado
  const product = await Product.findById(req.query.id);
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna o produto
  res.send(product);
});
export default handler;