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
  userFullName: string;
  userProfileImage: string = 'assets/images/user/mojianimation.png';
  isLoading: boolean = false;
  private userProfileService = inject(UserProfileService);
  // constructor
  constructor(
    private router: Router
  )
  {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-right';
  }

  ngOnInit(): void
  {
    this.loadUserProfile();
  }

  loadUserProfile(): void
  {
    this.isLoading = true;

    this.userProfileService.GetUserProfileCompleteAsync().subscribe({
      next: (profile: UserProfileComplete) =>
      {

        if (profile.fullName)
        {
          console.log('Setting FullName:', profile.fullName);
          this.userFullName = profile.fullName;
        } else if (profile.firstName && profile.lastName)
        {
          console.log('Setting from FirstName + LastName');
          this.userFullName = `${ profile.firstName } ${ profile.lastName }`;
        } else if (profile.firstName)
        {
          console.log('Setting from FirstName only');
          this.userFullName = profile.firstName;
        } else if (profile.username)
        {
          console.log('Setting from Username');
          this.userFullName = profile.username;
        }

        this.isLoading = false;
      },
      error: (error: any) =>
      {
        this.userFullName = 'User';
        this.isLoading = false;
      }
    });
  }

  logout(): void
  {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/auth/login']);
  }
}
