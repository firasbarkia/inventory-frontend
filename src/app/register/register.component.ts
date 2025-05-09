import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const registrationData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/auth/register', registrationData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(
        (response: any) => {
          console.log('Registration successful', response);
          alert('You will wait until an admin accept it');
        },
        error => {
          console.error('Registration failed', error);
          alert('Registration failed');
        }
      );
  }
}
