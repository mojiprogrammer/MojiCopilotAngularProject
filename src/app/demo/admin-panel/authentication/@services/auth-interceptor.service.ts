import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken');

    if (token)
    {
      // Clone the request and add the authorization header
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${ token }`)
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
