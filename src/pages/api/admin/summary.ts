import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';

import Order from '../../../model/Order';
import { isAdmin, isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import Product from '../../../model/Product';
import User from '../../../model/User';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca busca o total de registro em Order no database mongodb
  const ordersCount: number = await Order.countDocuments();
  // busca busca o total de registro em Product no database mongodb
  const productsCount: number = await Product.countDocuments();
  // busca busca o total de registro em User no database mongodb
  const usersCount: number = await User.countDocuments();
  // retorna a soma de totalPrice em Order
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  // se houver 1 ou mais registro no agrupamento, retornar o primeiro valor do array.
  // caso contrário, retorna 0;
  const ordersPrice: number =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna os valores encontrados
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});
export default handler;