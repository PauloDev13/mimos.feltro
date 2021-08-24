export interface IFormValues {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface IFormUpdateProducts {
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  countInStock: number;
  description: string;
}