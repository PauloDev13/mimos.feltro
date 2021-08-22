import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';

import Order from '../../../model/Order';
import { isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os produtos no database mongodb
  // @ts-ignore
  const orders = await Order.find({ user: req.user._id });
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna a lista de produtos
  res.send(orders);
});
export default handler;