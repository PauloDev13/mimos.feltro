import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { compareSync } from 'bcryptjs';

import db from '../../../utils/db';
import User from '../../../model/User';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre a conexão com database mongodb
  await db.connect();
  // busca usuário no database mongodb com o email informado
  const user = await User.findOne({ email: req.body.email });
  // fecha a conexão com database mongodb
  await db.disconnected();

  // se existir o usuário informado, compara a senhas
  if (user && compareSync(req.body.password, user.password)) {
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
  } else {
    // se não existir o usuário informado ou a senha não for validada, envia mensagem
    res.status(401).send({ message: 'Usuário e/ou Senha inválido!' });
  }
});
export default handler;