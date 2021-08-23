import { NextApiRequest, NextApiResponse } from 'next';
import { sign, verify } from 'jsonwebtoken';
import { IUser } from '../interfaces/IUser';

const signToken = (user: IUser) => {
  return sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || '',
    {
      expiresIn: '3d',
    },
  );
};

const isAuth = async (
  req: NextApiRequest | any,
  res: NextApiResponse,
  next: any,
) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    verify(token, process.env.JWT_SECRET || '', (err: any, decode: any) => {
      if (err) {
        res.status(401).send({ message: 'Credencias de usuário inválidas!' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Usuário não autorizado!' });
  }
};
const isAdmin = async (
  req: NextApiRequest | any,
  res: NextApiResponse,
  next: any,
) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({
      message: `Usuário ${req.user.email} não é Administrador do Mimos em Feltro!`,
    });
  }
};

export {signToken, isAuth, isAdmin};