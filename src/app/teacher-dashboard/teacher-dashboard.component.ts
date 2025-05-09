import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './teacher-dashboard.component.html',
})
export class TeacherDashboardComponent implements OnInit {
  username: string | null = null;
  role: string | null = null;
  items: any[] = [];
  requests: any[] = [];
  requestQuantities: { [itemId: number]: number } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');

    const token = localStorage.getItem('token');

    // Fetch all items
    this.http.get<any[]>('http://localhost:8080/api/items', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      items => {
        this.items = items;
        // Initialize requestQuantities for each item
        this.items.forEach(item => {
          this.requestQuantities[item.id] = 1; // Default quantity is 1
        });
      },
      error => {
        console.error('Error fetching items', error);
      }
    );

    // TODO: Fetch requests for the current teacher
    this.fetchRequests();
  }

  createRequest(itemId: number) {
    const token = localStorage.getItem('token');
    const requestData = {
      item: { id: itemId },
      quantity: this.requestQuantities[itemId],
      status: 'REQUESTED' // Default status
    };

    this.http.post('http://localhost:8080/api/requests', requestData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      response => {
        console.log('Request created successfully', response);
        alert('Request created successfully');
        this.fetchRequests(); // Refresh requests
      },
      error => {
        console.error('Error creating request', error);
        alert('Error creating request');
      }
    );
  }

  fetchRequests() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    this.http.get<any[]>(`http://localhost:8080/api/requests?teacher=${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      requests => {
        this.requests = requests;
      },
      error => {
        console.error('Error fetching requests', error);
      }
    );
  }

  deleteRequest(requestId: number) {
    const token = localStorage.getItem('token');
    this.http.delete(`http://localhost:8080/api/requests/${requestId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      () => {
        console.log('Request deleted successfully');
        this.fetchRequests(); // Refresh requests
      },
      error => {
        console.error('Error deleting request', error);
      }
    );
  }
}
