import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { hashSync } from 'bcryptjs';

import db from '../../../utils/db';
import User from '../../../model/User';
import signToken from '../../../utils/auth';

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre a conexão com database mongodb
  await db.connect();
  // cria um novo usuário com os dados enviados na requisição
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashSync(req.body.password),
    isAdmin: false,
  });
  // sava no novo usuário no database mongodb
  const user = await newUser.save();
  // fecha a conexão com database mongodb
  await db.disconnected();
  // cria o token com todos os dados do usuário
  const token = signToken(user);
  // envia a resposta com o token e os dados do usuário
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});
export default handler;