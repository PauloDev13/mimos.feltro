import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../../utils/db';
import Product from '../../../../../model/Product';
import { isAdmin, isAuth } from '../../../../../utils/auth';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os registros em Order no database mongodb exibindo o nome do usuário
  const product = await Product.findById({ _id: req.query.id });
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna os valores encontrados
  res.send(product);
});

export default handler;