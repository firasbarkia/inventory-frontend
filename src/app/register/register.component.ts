import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  register() {
    const registrationData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/api/auth/register', registrationData)
      .subscribe(
        response => {
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
