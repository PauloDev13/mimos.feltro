import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';

import db from '../../../utils/db';
import { isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import Order from '../../../model/Order';

const handler = nc({
  onError,
});

// usa o middleware isAuth para acessar o usuário logado
handler.use(isAuth);

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os produtos no database mongodb
  const newOrder = new Order({
    ...req.body,
    user: req.body.user._id,
  });
  const order = await newOrder.save();
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna a ordem de compra criada
  res.status(201).send(order);
});
export default handler;