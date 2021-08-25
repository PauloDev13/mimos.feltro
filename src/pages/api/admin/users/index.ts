import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../../model/User';
import db from '../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os registros em Order no database mongodb exibindo o nome do usuário
  const users = await User.find({});
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna os valores encontrados
  res.send(users);
});

export default handler;