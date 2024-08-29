export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    avatar: string;
    roles: string;
}

export interface ApiListResponse<T> {
    '@id': string;
    'hydra:totalItems': number;
    'hydra:member': T[];
  }

export interface Developer {
  id?: number; 
  studioName: string;
  website?: string; 
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  games?: Game[];
}

export interface Game {
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
  developer?: Developer;
}

