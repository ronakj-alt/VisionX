
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface DetectedObject {
  id: string;
  name: string;
  brand: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  products: Product[];
}

export interface Product {
  platform: string;
  title: string;
  price: string;
  link: string;
  imageUrl: string;
}

export interface VideoSource {
  url: string;
  type: 'local' | 'youtube' | 'direct';
}
