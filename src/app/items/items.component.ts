import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from '../models/item.model';
import { ItemFormComponent } from '../item-form/item-form.component';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'quantity', 'minStockLevel', 'supplierName', 'actions'];
  items: Item[] = [];
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.http.get<Item[]>('/api/items').subscribe(
      (data) => {
        this.items = data;
      },
      (error) => {
        console.error('Error loading items:', error);
        this.snackBar.open('Failed to load items.', 'Close', { duration: 3000 });
      }
    );
  }

  openItemForm(item?: Item): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      width: '400px',
      data: item ? { ...item } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.updateItem(result);
        } else {
          this.addItem(result);
        }
      }
    });
  }

  addItem(item: Item): void {
    this.http.post<Item>(`/api/items?supplierId=${item.supplierId}`, item).subscribe(
      (newItem) => {
        this.items = [...this.items, newItem];
        this.snackBar.open('Item added successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error adding item:', error);
        this.snackBar.open('Failed to add item.', 'Close', { duration: 3000 });
      }
    );
  }

  updateItem(item: Item): void {
    this.http.put<Item>(`/api/items/${item.id}`, item).subscribe(
      (updatedItem) => {
        this.items = this.items.map(i => i.id === updatedItem.id ? updatedItem : i);
        this.snackBar.open('Item updated successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error updating item:', error);
        this.snackBar.open('Failed to update item.', 'Close', { duration: 3000 });
      }
    );
  }

  deleteItem(id: number): void {
    this.http.delete(`/api/items/${id}`).subscribe(
      () => {
        this.items = this.items.filter(item => item.id !== id);
        this.snackBar.open('Item deleted successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error deleting item:', error);
        this.snackBar.open('Failed to delete item.', 'Close', { duration: 3000 });
      }
    );
  }
}
