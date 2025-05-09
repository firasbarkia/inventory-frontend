import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-supplier-dashboard',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './supplier-dashboard.component.html',
  styleUrl: './supplier-dashboard.component.css'
})
export class SupplierDashboardComponent implements OnInit {
  username: string | null = null;
  role: string | null = null;
  notifications: any[] = [];
  items: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');

    const token = localStorage.getItem('token');

    // Fetch supplier notifications
    this.http.get<any[]>('http://localhost:8080/api/notifications/supplier', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      notifications => {
        this.notifications = notifications;
      },
      error => {
        console.error('Error fetching supplier notifications', error);
      }
    );

    const supplierId = localStorage.getItem('supplierId');

    // Fetch items for the supplier
    this.http.get<any[]>(`http://localhost:8080/api/items?supplierId=${supplierId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      items => {
        this.items = items;
      },
      error => {
        console.error('Error fetching items', error);
      }
    );
  }
}
