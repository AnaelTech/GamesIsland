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
    
}