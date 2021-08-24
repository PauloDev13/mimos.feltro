import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../utils/db';
import Order from '../../../../model/Order';
import { isAuth } from '../../../../utils/auth';

const handler = nc();

handler.use(isAuth);

handler.get(
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    // abre conexão com o database mongodb
    await db.connect();
    // procura por um produto com o ID informado
    const order = await Order.findById(req.query.id);
    // fecha conexão com o database mongodb
    await db.disconnected();
    // retorna o produto
    return res.send(order);
  },
);
export default handler;