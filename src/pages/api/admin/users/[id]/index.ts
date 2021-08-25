import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../../utils/db';
import User from '../../../../../model/User';
import { isAdmin, isAuth } from '../../../../../utils/auth';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os registros em Order no database mongodb exibindo o nome do usuário
  const user = await User.findById({ _id: req.query.id });
  // fecha conexão com o database mongodb
  await db.disconnected();
  // retorna os valores encontrados
  res.send(user);
});

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, isAdmin } = req.body;
  // abre conexão com o database mongodb
  await db.connect();
  // busca todos os registros em User no database mongodb exibindo o nome do usuário
  const user = await User.findById({ _id: req.query.id });
  if (user) {
    user.name = name;
    user.isAdmin = Boolean(isAdmin);
    await user.save();
    // fecha conexão com o database mongodb
    await db.disconnected();
    res.send({ message: 'Usuário atualizado com sucesso' });
  } else {
    // fecha conexão com o database mongodb
    await db.disconnected();
    res.send({ message: 'Usuário não encontrado!' });
  }
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  // abre conexão com o database mongodb
  await db.connect();
  // procura pelo produto no database mongodb com o ID informado
  const user = await User.findById(req.query.id);
  // se o produto existe no database mongodb
  if (user) {
    // exclui o produto no database mongodb
    await user.remove();
    // fecha conexão com o database mongodb
    await db.disconnected();
    // exibe mensagem de sucesso
    res.send({ message: 'Usuário excluído' });
  } else {
    // exibe mensagem de erro com o status code 404
    res.status(404).send({ message: 'Usuário não encontrado!' });
  }
});

export default handler;