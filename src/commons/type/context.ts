import { Request, Response } from "express";

export interface IAuthUserItem {
  email: string;
  id: string;
  exp: number;
}

export interface IUserItem {
  email: string;
}

export interface IUser {
  user?: {
    email: string;
    id: string;
    exp: number;
    password: string;
  };
}

export interface IContext {
  req: Request & IUser;
  res: Response;
}
