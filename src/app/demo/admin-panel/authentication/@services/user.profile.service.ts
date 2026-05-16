// user-profile.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../api-response.interface';
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
    const token = localStorage.getItem('accessToken');

    let headers = new HttpHeaders();
    if (token)
    {
      headers = headers.set('Authorization', `Bearer ${ token }`);
    }

    // Map the API response to extract the data property
    return this.http.get<ApiResponse<UserProfileComplete>>(apiUrl, { headers })
      .pipe(
        map(response =>
        {
          if (response.success && response.data)
          {
            return response.data;
          }
          throw new Error(response.message || 'Failed to load profile');
        })
      );
  }
}
