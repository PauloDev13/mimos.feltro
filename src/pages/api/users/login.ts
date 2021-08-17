import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { compareSync } from 'bcryptjs';

import db from '../../../utils/db';
import User from '../../../model/User';
import signToken from '../../../utils/auth';

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  await db.disconnected();

  if (user && compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: 'Usuário e/ou Senha inválido!' });
  }
});
export default handler;