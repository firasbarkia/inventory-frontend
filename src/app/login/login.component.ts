import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLink],
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

    this.http.post('http://localhost:8080/api/auth/login', loginData, { responseType: 'text' })
      .subscribe(
        (response: any) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response);
          // Assuming the backend returns the username and roles in the response
          localStorage.setItem('username', this.username);
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Login failed', error);
          alert('Login failed');
        }
      );
  }
}
