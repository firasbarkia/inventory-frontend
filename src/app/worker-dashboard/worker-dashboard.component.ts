import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './worker-dashboard.component.html'
})
export class WorkerDashboardComponent implements OnInit {
  username: string | null = null;
  role: string | null = null;
  notifications: any[] = [];
  requests: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');

    const token = localStorage.getItem('token');

    // Fetch worker notifications
    this.http.get<any[]>('http://localhost:8080/api/notifications/worker', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      notifications => {
        this.notifications = notifications;
      },
      error => {
        console.error('Error fetching worker notifications', error);
      }
    );

    // Fetch requests assigned to the current worker
    this.fetchRequests();
  }

  fetchRequests() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    this.http.get<any[]>(`http://localhost:8080/api/requests?worker=${username}`, {
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

  updateRequestStatus(requestId: number) {
    const token = localStorage.getItem('token');
    const requestData = {
      status: 'APPROVED' // Default status
    };

    this.http.put(`http://localhost:8080/api/requests/${requestId}`, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      () => {
        console.log('Request status updated successfully');
        this.fetchRequests(); // Refresh requests
      },
      error => {
        console.error('Error updating request status', error);
      }
    );
  }
}
