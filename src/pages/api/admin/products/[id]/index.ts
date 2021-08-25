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

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    name,
    category,
    countInStock,
    description,
    image,
    slug,
    price,
    brand,
  } = req.body.productUpdate;
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os registros em Product no database mongodb exibindo o nome do usuário
  const product = await Product.findById({ _id: req.query.id });
  if (product) {
    product.name = name;
    product.slug = slug;
    product.price = price;
    product.category = category;
    product.image = image;
    product.brand = brand;
    product.countInStock = countInStock;
    product.description = description;
    await product.save();
    // fecha conexão com o database mongodb
    await db.disconnected();
    res.send({ message: 'Produto atualizado com sucesso_2' });
  } else {
    // fecha conexão com o database mongodb
    await db.disconnected();
    res.send({ message: 'Produto não encontrado!' });
  }
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // procura pelo produto no database mongodb com o ID informado
  const product = await Product.findById(req.query.id);
  // se o produto existe no database mongodb
  if (product) {
    // exclui o produto no database mongodb
    await product.remove();
    // fecha conexão com o database mongodb
    await db.disconnected();
    // exibe mensagem de sucesso
    res.send({ message: 'Produto excluído' });
  } else {
    // exibe mensagem de erro com o status code 404
    res.status(404).send({ message: 'Produto não encontrado!' });
  }
});

export default handler;