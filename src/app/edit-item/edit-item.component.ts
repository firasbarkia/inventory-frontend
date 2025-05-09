import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.css'
})
export class EditItemComponent implements OnInit {
  itemId: number = 0;
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
    this.route.params.subscribe(params => {
      this.itemId = +params['id']; // (+) converts string 'id' to a number
      this.getItemDetails();
    });
  }

  getItemDetails() {
    const token = localStorage.getItem('token');
    this.http.get(`http://localhost:8080/api/items/${this.itemId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      (item: any) => {
        this.name = item.name;
        this.description = item.description;
        this.price = item.price;
        this.quantity = item.quantity;
        this.minStockLevel = item.minStockLevel;
      },
      error => {
        console.error('Error fetching item details', error);
        alert('Error fetching item details');
      }
    );
  }

  updateItem() {
    const itemData = {
      name: this.name,
      description: this.description,
      price: this.price,
      quantity: this.quantity,
      minStockLevel: this.minStockLevel
    };

    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8080/api/items/${this.itemId}`, itemData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .subscribe(
      response => {
        console.log('Item updated successfully', response);
        alert('Item updated successfully');
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Error updating item', error);
        alert('Error updating item');
      }
    );
  }
}
