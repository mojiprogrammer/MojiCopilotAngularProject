// nav-right.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComplete } from '../../../../../demo/admin-panel/authentication/@intermediate/models/user-profile.model';
import { UserProfileService } from '../../../../../demo/admin-panel/authentication/@services/user.profile.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit
{
  // public props
  userFullName: string;
  userProfileImage: string = 'assets/images/user/mojianimation.png';
  isLoading: boolean = false;
  private userProfileService = inject(UserProfileService);
  // constructor
  constructor(
    //private userProfileService: UserProfileService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router
  )
  {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-right';
  }

  ngOnInit(): void
  {

    console.log('=== Token Check ===');
    console.log('auth_token:', localStorage.getItem('auth_token'));
    console.log('accessToken:', localStorage.getItem('accessToken'));
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('==================');


    this.loadUserProfile();
  }

  loadUserProfile(): void
  {
    this.isLoading = true;
    console.log('Starting profile fetch...');

    this.userProfileService.GetUserProfileCompleteAsync().subscribe({
      next: (profile: UserProfileComplete) =>
      {
        console.log('API Response received:', profile);
        console.log('Profile FullName:', profile?.FullName);
        console.log('Profile type:', typeof profile);
        console.log('Profile keys:', Object.keys(profile));

        if (profile.FullName)
        {
          console.log('Setting FullName:', profile.FullName);
          this.userFullName = profile.FullName;
        } else if (profile.FirstName && profile.LastName)
        {
          console.log('Setting from FirstName + LastName');
          this.userFullName = `${ profile.FirstName } ${ profile.LastName }`;
        } else if (profile.FirstName)
        {
          console.log('Setting from FirstName only');
          this.userFullName = profile.FirstName;
        } else if (profile.Username)
        {
          console.log('Setting from Username');
          this.userFullName = profile.Username;
        }

        this.isLoading = false;
      },
      error: (error: any) =>
      {
        console.error('Error in subscription:', error);
        console.error('Error status:', error?.status);
        console.error('Error message:', error?.message);
        this.userFullName = 'User';
        this.isLoading = false;
      }
    });
  }

  logout(): void
  {
    // Clear tokens - use the same keys as your login component
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Navigate to login page
    this.router.navigate(['/auth/login']);
  }
}
