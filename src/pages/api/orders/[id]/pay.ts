import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import Order from '../../../../model/Order';

const handler = nc({ onError });

handler.put(
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    // abre conexão com o database mongodb
    await db.connect();
    // procura por um produto com o ID informado
    const order = await Order.findById(req.query.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now().toString();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        email_address: req.body.email_address,
      };
      const paidOrder = await order.save();
      // fecha conexão com o database mongodb
      await db.disconnected();
      // retorna uma mensagem
      res.send({ message: 'Pedido Pago', order: paidOrder });
    } else {
      await db.disconnected();
      // retorna uma mensagem
      res.status(404).send({ message: 'Pedido não encontrado!' });
    }
  },
);
export default handler;