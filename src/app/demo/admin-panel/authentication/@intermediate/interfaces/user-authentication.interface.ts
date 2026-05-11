import { Observable } from "rxjs";
import { RegisterLoginRequest, RegisterLoginResponse } from "../models/user-authentication.model";

export interface IAuthService
{
  RegisterAndLoginAsync(request: RegisterLoginRequest): Observable<RegisterLoginResponse>;
}
