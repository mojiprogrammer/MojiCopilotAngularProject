import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthService } from '../@intermediate/interfaces/user-authentication.interface';
import { LoginRequest, LoginResponse, RegisterLoginRequest, RegisterLoginResponse } from '../@intermediate/models/user-authentication.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService
{
  private readonly serviceUrl = 'https://localhost:5864';

  constructor(private http: HttpClient) { }

  RegisterAsync(request: RegisterLoginRequest): Observable<RegisterLoginResponse>
  {
    const apiUrl = `${ this.serviceUrl }/api/Auth/Register`;
    return this.http.post<RegisterLoginResponse>(apiUrl, request);
  }
  UserLoginAsync(request: LoginRequest): Observable<LoginResponse>
  {
    const apiUrl = `${ this.serviceUrl }/api/Auth/UserLogin`;
    return this.http.post<LoginResponse>(apiUrl, request);
  }

}
