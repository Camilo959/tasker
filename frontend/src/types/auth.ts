import type { BackendUser } from "../auth/context";

export interface LoginResponse {
  token: string;
  user: BackendUser;
}