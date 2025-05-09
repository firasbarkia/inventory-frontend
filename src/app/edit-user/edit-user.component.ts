import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  userId: number = 0;
  username = '';
  email = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // (+) converts string 'id' to a number
      this.getUserDetails();
    });
  }

  getUserDetails() {
    const token = localStorage.getItem('token');
    this.http.get(`http://localhost:8080/api/admin/users/${this.userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      (user: any) => {
        this.username = user.username;
        this.email = user.email;
      },
      error => {
        console.error('Error fetching user details', error);
        alert('Error fetching user details');
      }
    );
  }

  updateUser() {
    const userData = {
      username: this.username,
      email: this.email,
    };

    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8080/api/admin/users/${this.userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      response => {
        console.log('User updated successfully', response);
        alert('User updated successfully');
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Error updating user', error);
        alert('Error updating user');
      }
    );
  }
}
