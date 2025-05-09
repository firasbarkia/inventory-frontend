import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
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
      .subscribe(
        (response: any) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          const decodedToken: any = jwtDecode(response.token);
          localStorage.setItem('username', this.username);
          localStorage.setItem('role', decodedToken.roles[0]);
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Login failed', error);
          alert('Login failed');
        }
      );
  }
}
