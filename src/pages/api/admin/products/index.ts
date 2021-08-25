import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import Product from '../../../../model/Product';
import db from '../../../../utils/db';

const handler = nc();

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

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const newProduct = await Product.create({
    name: 'produto nome',
    slug: 'produto slug',
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'produto categoria',
    brand: 'produto marca',
    countInStock: 0,
    description: 'produto descrição',
    rating: 0,
    numReview: 0,
  });
  const product = await newProduct.save();
  await db.disconnected();
  res.send({ message: 'Produto criado', product });
});

export default handler;