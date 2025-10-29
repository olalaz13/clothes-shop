export interface Product {
  id: number;
  title: string;
  price: number;
  cat: string;
  img: string;
  desc: string;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  qty: number;
}