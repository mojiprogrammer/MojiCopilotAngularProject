import { Observable } from "rxjs";
import { LoginRequestDto, RegisterLoginRequest, RegisterLoginResponse } from "../models/user-authentication.model";

export interface IAuthService
{
  RegisterAsync(request: RegisterLoginRequest): Observable<RegisterLoginResponse>;
  LoginAsync(request: LoginRequestDto): Observable<RegisterLoginResponse>;
}
