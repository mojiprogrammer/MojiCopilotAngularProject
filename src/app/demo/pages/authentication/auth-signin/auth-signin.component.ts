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
  isLoading = signal(false); // Track loading state for social login

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

  // ==================== SOCIAL LOGIN METHODS ====================

  loginWithGoogle(): void
  {
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const clientId = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
    const redirectUri = `${ window.location.origin }/auth/callback`;
    const scope = 'openid profile email';

    this.openOAuthPopup('Google', authUrl, {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      prompt: 'consent',
      access_type: 'offline'
    });
  }

  loginWithFacebook(): void
  {
    const authUrl = 'https://www.facebook.com/v19.0/dialog/oauth';
    const clientId = 'YOUR_FACEBOOK_APP_ID';
    const redirectUri = `${ window.location.origin }/auth/callback`;
    const scope = 'email,public_profile';

    this.openOAuthPopup('Facebook', authUrl, {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      response_type: 'code'
    });
  }

  loginWithLinkedIn(): void
  {
    const authUrl = 'https://www.linkedin.com/oauth/v2/authorization';
    const clientId = '78ji4d08mq5npx';
    const redirectUri = `${ window.location.origin }/auth/callback`;
    const scope = 'openid profile email';

    this.openOAuthPopup('LinkedIn', authUrl, {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope
    });
  }

  // ==================== POPUP HANDLER ====================

  private openOAuthPopup(provider: string, authUrl: string, params: Record<string, string>): void
  {
    // Generate state for CSRF protection
    const state = this.generateRandomString(40);
    sessionStorage.setItem('oauth_state', state);
    params['state'] = state;

    // Build the full URL
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${ authUrl }?${ queryString }`;

    // Calculate popup dimensions
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    // Popup window options
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

    // Show loading state
    this.isLoading.set(true);
    this.cd.detectChanges();

    // Open the popup
    const popup = window.open(fullUrl, `${ provider } OAuth`, windowFeatures);

    if (!popup)
    {
      // Popup was blocked
      this.isLoading.set(false);
      this.error.set('Popup was blocked. Please allow popups for this site.');
      this.cd.detectChanges();
      return;
    }

    // Monitor the popup for OAuth callback
    this.ngZone.runOutsideAngular(() =>
    {
      const popupCheckInterval = setInterval(() =>
      {
        try
        {
          // Check if popup is closed
          if (popup.closed)
          {
            clearInterval(popupCheckInterval);
            this.ngZone.run(() =>
            {
              this.isLoading.set(false);
              this.cd.detectChanges();
            });
            return;
          }

          // Check if popup has been redirected to our callback URL
          if (popup.location.href.includes('/auth/callback'))
          {
            const urlParams = new URLSearchParams(popup.location.search);
            const code = urlParams.get('code');
            const returnedState = urlParams.get('state');
            const error = urlParams.get('error');

            clearInterval(popupCheckInterval);

            this.ngZone.run(() =>
            {
              if (error)
              {
                // OAuth error received
                this.isLoading.set(false);
                this.error.set(`${ provider } login failed: ${ error }`);
                popup.close();
                this.cd.detectChanges();
                return;
              }

              // Verify state to prevent CSRF
              const savedState = sessionStorage.getItem('oauth_state');
              if (returnedState !== savedState)
              {
                this.isLoading.set(false);
                this.error.set('Security validation failed. Please try again.');
                popup.close();
                sessionStorage.removeItem('oauth_state');
                this.cd.detectChanges();
                return;
              }

              if (code)
              {
                // Success! Send code to backend
                this.handleOAuthCallback(provider, code);
                popup.close();
                sessionStorage.removeItem('oauth_state');
              } else
              {
                this.isLoading.set(false);
                this.error.set('No authorization code received from ${provider}');
                popup.close();
                this.cd.detectChanges();
              }
            });
          }
        } catch (e)
        {
          // Cross-origin error when popup is on provider's domain - this is expected
          // Just continue checking until popup redirects to our domain
        }
      }, 500); // Check every 500ms
    });
  }

  // ==================== BACKEND COMMUNICATION ====================

  private async handleOAuthCallback(provider: string, code: string): Promise<void>
  {
    try
    {
      // Replace with your actual backend endpoint
      const response = await fetch('/api/auth/social-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: provider.toLowerCase(),
          code: code,
          redirectUri: `${ window.location.origin }/auth/callback`
        })
      });

      if (!response.ok)
      {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Handle successful login
      // Store token, redirect, etc.
      console.log(`${ provider } login successful:`, data);

      // Example: Store token and navigate
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate to dashboard or home
      this.router.navigate(['/dashboard']);

    } catch (err: any)
    {
      this.isLoading.set(false);
      this.error.set(err.message || 'Login failed. Please try again.');
      this.cd.detectChanges();
    }
  }

  // ==================== UTILITY ====================

  private generateRandomString(length: number): string
  {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  // Clean up state when component is destroyed
  ngOnDestroy()
  {
    sessionStorage.removeItem('oauth_state');
  }
}
