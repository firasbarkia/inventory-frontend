import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterModule } from '@angular/router'; // Import RouterModule
// import { BrowserModule } from '@angular/platform-browser'; // Import BrowserModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faUsers, faTruck, faBell, faFileAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule to imports
    RouterModule, // Add RouterModule to imports
    // BrowserModule, // Remove BrowserModule from imports
    FontAwesomeModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  username: string | null = null;

  faBox = faBox;
  faUsers = faUsers;
  faTruck = faTruck;
  faBell = faBell;
  faFileAlt = faFileAlt;

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }
}
