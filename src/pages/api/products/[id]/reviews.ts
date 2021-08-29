import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { isAuth } from '../../../../utils/auth';
import Product from '../../../../model/Product';
import { IReview } from '../../../../interfaces/IReview';

const handler = nc({
  onError,
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca um produto por ID no database mongodb
  const product = await Product.findById(req.query.id);

  if (product) {
    // se existir o produto, retorna
    res.send(product.reviews);
  } else {
    // se não, retorna uma mensagem
    res.status(404).send({message: 'Produto não encontrado!'});
  }
  // fecha conexão com o database mongodb
  await db.disconnected();
});

handler
.use(isAuth)
.post(async (req: NextApiRequest | any, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca um produto por ID no database mongodb
  const product = await Product.findById(req.query.id);

  if (product) {
    const existReview = product.reviews.find((x) => (x.user = req.user._id));

    if (existReview) {
      await Product.updateOne(
        {
          _id: req.query.id,
          'reviews._id': existReview._id,
        },
        {
          $set: {
            'reviews.$.comment': req.body.comment,
            'reviews.$.rating': Number(req.body.rating),
          },
        },
      );
      const updatedProduct = await Product.findById(req.query.id);

      if (updatedProduct) {
        updatedProduct.numReviews = updatedProduct.reviews.length;
        updatedProduct.rating =
          updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
          updatedProduct.reviews.length;
        await updatedProduct.save();

        await db.disconnected();
        return res.status(200).send({
          message: 'Avaliação atualizada',
        });
      }

      await db.disconnected();
      return res.send({message: 'Avaliação atualizada'});
    } else {
      const review: IReview = {
        user: mongoose.Types.ObjectId(req.user._id),
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      // @ts-ignore
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      await product.save();
      await db.disconnected();
      return res.status(200).send({
        message: 'Avaliação salva',
      });
    }
  } else {
    // fecha conexão com o database mongodb
    await db.disconnected();
    // se não, retorna uma mensagem
    return res.status(404).send({message: 'Produto não encontrado!'});
  }
});

export default handler;