import { UserEntity } from "../entity/user-entity";
import HttpRequest, { HttpMethod } from "./http";

export interface ResponseEntity<T> {
  code: number;
  message: string;
  data: T;
  token?: string;
}

export const apiStore = {
  //登录
  login(username: string, password: string): HttpRequest<UserEntity> {
    return new HttpRequest("/api/auth/login", HttpMethod.POST, {
      username: username,
      password: password,
    });
  },
  register(username: string, password: string): HttpRequest<UserEntity> {
    return new HttpRequest("/api/auth/register", HttpMethod.POST, {
      username: username,
      password: password,
    });
  },
};
