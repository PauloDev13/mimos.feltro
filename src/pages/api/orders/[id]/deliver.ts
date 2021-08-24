import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';

import Order from '../../../../model/Order';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { isAdmin, isAuth } from '../../../../utils/auth';

const handler = nc({ onError });

handler.use(isAuth, isAdmin);

handler.put(
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    // abre conexão com o database mongodb
    await db.connect();
    // procura por um produto com o ID informado
    const order = await Order.findById(req.query.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now().toString();
      // Salva o pedido
      const deliveredOrder = await order.save();
      // fecha conexão com o database mongodb
      await db.disconnected();
      // retorna uma mensagem
      res.send({ message: 'Pedido enviado', order: deliveredOrder });
    } else {
      await db.disconnected();
      // retorna uma mensagem
      res.status(404).send({ message: 'Pedido não encontrado!' });
    }
  },
);
export default handler;