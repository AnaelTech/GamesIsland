export interface User {
    '@id': string;
    '@type': string;
    id: number;
    username: string;
    email: string;
    password: string;
    avatar: string;
    roles: string;
    wishList: WishList;
}

export interface ApiListResponse<T> {
    '@id': string;
    'hydra:totalItems': number;
    'hydra:member': T[];
  }

export interface ApiResponse<L> {
    'hydra:member': L[];
}

export interface Developer {
  '@id': string;
  id?: number; 
  studioName: string;
  website?: string; 
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  games?: Game[];
}

export interface Game {
  [x: string]: any;
  '@id': string;
  id?: number; 
  title: string;
  description: string;
  price: string; 
  releaseDate: Date;
  genre: string;
  platform: string;
  coverImage: string;
  trailerUrl?: string; 
  createdAt: Date;
  updateAt: Date; 
  developer: string;
}

export interface WishList {
  id?: number;
  user: string ;
  games: string[];
  createdAt: Date;  
}

export interface Token {
  token: string;
  refreshToken: string;
}

