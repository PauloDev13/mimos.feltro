import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAdmin, isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import Product from '../../../model/Product';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os registros em Order no database mongodb exibindo o nome do usuário
  const products = await Product.find({});
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna os valores encontrados
  res.send(products);
});
export default handler;