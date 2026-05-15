// user-profile.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserProfileService } from '../@intermediate/interfaces/user.profile.interface';
import { UserProfileComplete } from '../@intermediate/models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService implements IUserProfileService
{
  private readonly serviceUrl = 'https://localhost:5864';

  constructor(private http: HttpClient) { }

  GetUserProfileCompleteAsync(): Observable<UserProfileComplete>
  {
    const apiUrl = `${ this.serviceUrl }/api/UserProfile/Profile`;
    return this.http.get<UserProfileComplete>(apiUrl);
  }
}
