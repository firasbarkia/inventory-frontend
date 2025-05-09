import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const loginData = {
      username: this.username,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/auth/login', loginData)
      .subscribe({
        next: (response: any) => {
          console.log('Login successful', response);

          // Check if account is pending
          if (response.accountStatus === 'PENDING') {
            alert('Your account is pending approval by an administrator. Please try again later.');
            return;
          }

          localStorage.setItem('token', response.token);
          const decodedToken: any = jwtDecode(response.token);
          localStorage.setItem('username', this.username);
          localStorage.setItem('role', decodedToken.roles[0]);

          // Navigate based on role
          if (decodedToken.roles.includes('ADMIN')) {
            this.router.navigate(['/dashboard']);
          } else if (decodedToken.roles.includes('WORKER')) {
            this.router.navigate(['/worker-dashboard']);
          } else if (decodedToken.roles.includes('TEACHER')) {
            this.router.navigate(['/teacher-dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          if (error.status === 401) {
            alert('Invalid username or password');
          } else {
            alert('Login failed: ' + (error.error || 'Unknown error'));
          }
        }
      });
  }
}
