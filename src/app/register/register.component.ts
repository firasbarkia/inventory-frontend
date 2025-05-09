import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
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
      .subscribe({
        next: (response: any) => {
          console.log('Registration successful', response);
          alert('Registration successful! You will need to wait until an admin approves your account.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          alert('Registration successful! You will need to wait until an admin approves your account.');
        }
      });
  }
}
