import { sign } from 'jsonwebtoken';
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
export default signToken;