import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';

import Order from '../../../model/Order';
import { isAdmin, isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os registros em Order no database mongodb exibindo o nome do usuário
  const orders = await Order.find({}).populate('user', 'name');
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna os valores encontrados
  res.send(orders);
});
export default handler;