import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { hashSync } from 'bcryptjs';

import db from '../../../utils/db';
import User from '../../../model/User';
import { isAuth, signToken } from '../../../utils/auth';

const handler = nc();

handler.use(isAuth);

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre a conexão com database mongodb
  await db.connect();
  // busca usuário com os dados enviados na requisição
  // @ts-ignore
  const user: any = await User.findById(req.user._id);
  console.log('USER ' + JSON.stringify(user));
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password
    ? hashSync(req.body.password)
    : user.password;

  // salva o usuário no database mongodb
  await user.save();
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