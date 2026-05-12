import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterLoginRequest, RegisterLoginResponse } from '../../../admin-panel/authentication/@intermediate/models/user-authentication.model';
import { AuthService } from '../../../admin-panel/authentication/@services/user-authentication.service';

@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    HttpClientModule
  ],
})
export class AuthSignupComponent
{
  private cd = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  submitted = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phone: [''],
    dateOfBirth: [''],
    saveDetails: [false],
    newsletter: [false]
  });

  constructor()
  {
    // Optional: Add custom validators
    this.registerForm.get('username')?.setValidators([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]);
  }

  onSubmit(event: Event)
  {
    event.preventDefault();
    this.submitted.set(true);
    this.errorMessage.set('');

    this.cd.detectChanges();

    if (this.registerForm.invalid)
    {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key =>
      {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.register();
  }

  register()
  {
    this.isLoading.set(true);

    const request: RegisterLoginRequest = {
      Email: this.registerForm.value.email || '',
      Username: this.registerForm.value.username || '',
      Password: this.registerForm.value.password || '',
      FirstName: this.registerForm.value.firstName || '',
      LastName: this.registerForm.value.lastName || '',
      Phone: this.registerForm.value.phone || '',
      DateOfBirth: this.registerForm.value.dateOfBirth ? new Date(this.registerForm.value.dateOfBirth) : new Date()
    };

    this.authService.RegisterAsync(request).subscribe({
      next: (response: RegisterLoginResponse) =>
      {
        this.isLoading.set(false);

        if (response.Success)
        {
          // Store tokens in localStorage/sessionStorage
          if (response.AccessToken)
          {
            localStorage.setItem('access_token', response.AccessToken);
          }

          // Navigate to login or dashboard
          this.router.navigate(['/login'], {
            queryParams: { registered: true, message: response.Message }
          });
        } else
        {
          this.errorMessage.set(response.Message || 'Registration Success');
          this.cd.detectChanges();
        }
      },
      error: (error) =>
      {
        this.isLoading.set(false);
        console.error('Registration error:', error);

        if (error.error && error.error.Message)
        {
          this.errorMessage.set(error.error.Message);
        } else if (error.status === 0)
        {
          this.errorMessage.set('Network error. Please check your connection.');
        } else
        {
          this.errorMessage.set('An error occurred during registration. Please try again.');
        }
        this.cd.detectChanges();
      }
    });
  }

  togglePasswordVisibility()
  {
    this.showPassword.set(!this.showPassword());
  }

  // Helper getters for template
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get password() { return this.registerForm.get('password'); }
}
