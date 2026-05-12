import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone, signal } from '@angular/core';
import { email, Field, form, minLength, required } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../../theme/shared/shared.module';
// ... your other imports

@Component({
  selector: 'app-auth-signin',
  imports: [CommonModule, RouterModule, SharedModule, Field],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent
{
  private cd = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private router = inject(Router);

  submitted = signal(false);
  error = signal('');
  showPassword = signal(false);
  isLoading = signal(false);

  // LinkedIn Configuration
  private readonly LINKEDIN_CONFIG = {
    clientId: '78ji4d08mq5npx',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    //https://www.linkedin.com/developers/apps/verification/bf025b27-76cf-44f2-9b56-9a042fb35906
    redirectUri: 'http://localhost:4200/home-page',
    scope: 'mojtaba.tavakoli2@gmail.com'
  };

  loginModal = signal<{ email: string; password: string; }>({
    email: '',
    password: ''
  });

  loginForm = form(this.loginModal, (schemaPath) =>
  {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' });
  });

  onSubmit(event: Event)
  {
    this.submitted.set(true);
    this.error.set('');
    event.preventDefault();
    const credentials = this.loginModal();
    console.log('login user logged in with:', credentials);
    this.cd.detectChanges();
  }

  togglePasswordVisibility()
  {
    this.showPassword.set(!this.showPassword());
  }

  loginWithLinkedIn(): void
  {
    console.log('Initiating LinkedIn login...');

    // Generate state for CSRF protection
    const state = this.generateRandomString(40);
    sessionStorage.setItem('linkedin_oauth_state', state);

    // Build the authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.LINKEDIN_CONFIG.clientId,
      redirect_uri: this.LINKEDIN_CONFIG.redirectUri,
      scope: this.LINKEDIN_CONFIG.scope,
      state: state
    });

    const authUrl = `${ this.LINKEDIN_CONFIG.authUrl }?${ params.toString() }`;

    console.log('LinkedIn Auth URL:', authUrl);

    this.openLinkedInPopup(authUrl);
  }

  private openLinkedInPopup(authUrl: string): void
  {
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const windowFeatures = `
      width=${ width },
      height=${ height },
      left=${ left },
      top=${ top },
      toolbar=no,
      menubar=no,
      scrollbars=yes,
      resizable=no,
      location=no,
      status=no
    `;

    this.isLoading.set(true);
    this.cd.detectChanges();

    const popup = window.open(authUrl, 'LinkedIn OAuth', windowFeatures);

    if (!popup)
    {
      this.isLoading.set(false);
      this.error.set('Popup was blocked. Please allow popups for this site and try again.');
      this.cd.detectChanges();
      return;
    }

    this.ngZone.runOutsideAngular(() =>
    {
      const popupCheckInterval = setInterval(() =>
      {
        try
        {
          if (popup.closed)
          {
            clearInterval(popupCheckInterval);
            this.ngZone.run(() =>
            {
              this.isLoading.set(false);
              console.log('LinkedIn popup was closed by user');
              this.cd.detectChanges();
            });
            return;
          }

          if (popup.location.href.includes('/auth/callback'))
          {
            const urlParams = new URLSearchParams(popup.location.search);
            const code = urlParams.get('code');
            const returnedState = urlParams.get('state');
            const error = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');

            clearInterval(popupCheckInterval);

            this.ngZone.run(() =>
            {
              if (error)
              {
                console.error('LinkedIn OAuth error:', error, errorDescription);
                this.isLoading.set(false);
                this.error.set(`LinkedIn login failed: ${ errorDescription || error }`);
                popup.close();
                this.cd.detectChanges();
                return;
              }

              const savedState = sessionStorage.getItem('linkedin_oauth_state');
              if (returnedState !== savedState)
              {
                this.isLoading.set(false);
                this.error.set('Security validation failed. Please try again.');
                popup.close();
                sessionStorage.removeItem('linkedin_oauth_state');
                this.cd.detectChanges();
                return;
              }

              if (code)
              {
                console.log('LinkedIn authorization code received');
                this.handleLinkedInCallback(code);
                popup.close();
                sessionStorage.removeItem('linkedin_oauth_state');
              } else
              {
                this.isLoading.set(false);
                this.error.set('No authorization code received from LinkedIn');
                popup.close();
                this.cd.detectChanges();
              }
            });
          }
        } catch (e)
        {
          console.log(e);
        }
      }, 500);
    });
  }

  private async handleLinkedInCallback(code: string): Promise<void>
  {
    try
    {
      const response = await fetch('/api/auth/linkedin/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirectUri: this.LINKEDIN_CONFIG.redirectUri
        })
      });

      if (!response.ok)
      {
        const errorData = await response.json();
        throw new Error(errorData.message || 'LinkedIn login failed');
      }

      const data = await response.json();

      if (data.token)
      {
        localStorage.setItem('auth_token', data.token);
      }
      if (data.user)
      {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      this.router.navigate(['/dashboard']);

    } catch (err: any)
    {
      console.error('LinkedIn callback error:', err);
      this.isLoading.set(false);
      this.error.set(err.message || 'LinkedIn login failed. Please try again.');
      this.cd.detectChanges();
    }
  }

  private generateRandomString(length: number): string
  {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  ngOnDestroy()
  {
    sessionStorage.removeItem('linkedin_oauth_state');
  }
}
