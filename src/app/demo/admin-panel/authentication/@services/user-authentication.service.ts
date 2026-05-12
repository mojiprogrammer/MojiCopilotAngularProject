import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthService } from '../@intermediate/interfaces/user-authentication.interface';
import { LoginRequestDto, RegisterLoginRequest, RegisterLoginResponse } from '../@intermediate/models/user-authentication.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService
{
  private readonly serviceUrl = 'https://localhost:7169';

  constructor(private http: HttpClient) { }

  RegisterAsync(request: RegisterLoginRequest): Observable<RegisterLoginResponse>
  {
    const apiUrl = `${ this.serviceUrl }/api/Auth/Register`;
    return this.http.post<RegisterLoginResponse>(apiUrl, request);
  }
  LoginAsync(request: LoginRequestDto): Observable<RegisterLoginResponse>
  {
    const apiUrl = `${ this.serviceUrl }/api/Auth/Login`;
    return this.http.post<RegisterLoginResponse>(apiUrl, request);
  }
}
