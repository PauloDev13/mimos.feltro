import { hashSync } from 'bcryptjs';

import { IProduct } from '../interfaces/IProduct';
import { IUser } from '../interfaces/IUser';

interface IData {
  users: IUser[];
  products: IProduct[];
}

const data: IData = {
  users: [
    {
      name: 'Paulo Roberto',
      email: 'prmorais1302@gmail.com',
      password: hashSync('P@ulo1313'),
      isAdmin: true,
    },
    {
      name: 'Maria Fernanda',
      email: 'nanda04@gmail.com',
      password: hashSync('N@nda04'),
      isAdmin: true,
    },
  ],
  products: [
    {
      name: 'Free Shirt',
      slug: 'free-shirt',
      category: 'Shirts',
      image: '/images/shirt1.jpg',
      price: 70,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
      reviews: [],
    },
    {
      name: 'Fit Shirt',
      slug: 'fit-shirt',
      category: 'Shirts',
      image: '/images/shirt2.jpg',
      price: 80,
      brand: 'Adidas',
      rating: 4.2,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
      reviews: [],
    },
    {
      name: 'Slim Shirt',
      slug: 'slim-shirt',
      category: 'Shirts',
      image: '/images/shirt3.jpg',
      price: 90,
      brand: 'Raymond',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
      reviews: [],
    },
    {
      name: 'Golf Pants',
      slug: 'golf-pants',
      category: 'Pants',
      image: '/images/pants1.jpg',
      price: 90,
      brand: 'Oliver',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'Smart looking pants',
      reviews: [],
    },
    {
      name: 'Fit Pants',
      slug: 'fit-pants',
      category: 'Pants',
      image: '/images/pants2.jpg',
      price: 95,
      brand: 'Zara',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular pants',
      reviews: [],
    },
    {
      name: 'Classic Pants',
      slug: 'classic-pants',
      category: 'Pants',
      image: '/images/pants3.jpg',
      price: 75,
      brand: 'Casely',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular pants',
      reviews: [],
    },
  ],
};
export default data;