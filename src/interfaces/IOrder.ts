export interface IOrder {
  _id: string;
  orderItems: [
    {
      _id: string;
      name: string;
      quantity: number;
      image: string;
      price: number;
    },
  ];
  shippingAddress: {
    fullName: String;
    address: String;
    city: String;
    postalCode: String;
    country: String;
  };
  paymentMethod: string;
  paymentResult: {
    id: String;
    status: String;
    email_address: String;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: string;
  deliveredAt: string;
}

export const InitialOrder: IOrder = {
  _id: '',
  orderItems: [
    {
      _id: '',
      name: '',
      quantity: 0,
      image: '',
      price: 0,
    },
  ],
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
  paymentMethod: '',
  paymentResult: {
    id: '',
    status: '',
    email_address: '',
  },
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  isPaid: false,
  paidAt: '',
  isDelivered: false,
  deliveredAt: '',
};