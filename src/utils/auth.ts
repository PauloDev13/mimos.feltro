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

const isAuth = async (req: NextApiRequest, res: NextApiResponse, next: any) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    verify(token, process.env.JWT_SECRET || '', (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Credencias de usuário inválidas!' });
      } else {
        req.body.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Usuário não autorizado!' });
  }
};

export {signToken, isAuth};