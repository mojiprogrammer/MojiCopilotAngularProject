import { Observable } from "rxjs";
import { LoginRequest, LoginResponse, RegisterLoginRequest, RegisterLoginResponse } from "../models/user-authentication.model";

export interface IAuthService
{
  RegisterAsync(request: RegisterLoginRequest): Observable<RegisterLoginResponse>;
  UserLoginAsync(request: LoginRequest): Observable<LoginResponse>;
}
