import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-supplier',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './add-supplier.component.html',
  styleUrl: './add-supplier.component.css'
})
export class AddSupplierComponent {
  name = '';
  email = '';
  phone = '';

  constructor(private http: HttpClient, private router: Router) {}

  addSupplier() {
    const supplierData = {
      name: this.name,
      email: this.email,
      phone: this.phone
    };

    const token = localStorage.getItem('token');

    this.http.post('http://localhost:8080/api/suppliers', supplierData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .subscribe(
        (response: any) => {
          console.log('Supplier added successfully', response);
          alert('Supplier added successfully');
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Error adding supplier', error);
          alert('Error adding supplier');
        }
      );
  }
}
