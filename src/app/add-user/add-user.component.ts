import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  username = '';
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  addUser() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    const token = localStorage.getItem('token');
    this.http.post('http://localhost:8080/api/admin/users', userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      response => {
        console.log('User added successfully', response);
        alert('User added successfully');
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Error adding user', error);
        alert('Error adding user');
      }
    );
  }
}
