import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent implements OnInit {
  supplierId: number = 0;
  name = '';
  description = '';
  price = 0;
  quantity = 0;
  minStockLevel = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.supplierId = +params['supplierId'];
    });
  }

  addItem() {
    const itemData = {
      name: this.name,
      description: this.description,
      price: this.price,
      quantity: this.quantity,
      minStockLevel: this.minStockLevel
    };

    const token = localStorage.getItem('token');
    this.http.post(`http://localhost:8080/api/items?supplierId=${this.supplierId}`, itemData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      response => {
        console.log('Item added successfully', response);
        alert('Item added successfully');
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Error adding item', error);
        alert('Error adding item');
      }
    );
  }
}
