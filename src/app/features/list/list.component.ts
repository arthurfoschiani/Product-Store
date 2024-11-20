import { ConfirmationDialogComponent } from './../../shared/services/confirmation-dialog.service';
import { Product } from '../../shared/interfaces/product.interface';
import { ProductsService } from './../../shared/services/products.service';
import { Component, inject } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent, RouterLink, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  products: Product[] = [];

  productsService = inject(ProductsService);
  confirmationDialogComponent = inject(ConfirmationDialogService);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);

  ngOnInit() {
    this.productsService.getAll().subscribe((products) => {
      this.products = products;
    });
  }

  onEdit(product: Product) {
    this.router.navigate(['/edit-product', product.id]);
  }

  onDelete(product: Product) {
    this.confirmationDialogComponent
      .openDialog()
      .pipe(filter((answer) => answer))
      .subscribe(() => {
        this.productsService.delete(product.id).subscribe(() => {
          const index = this.products.findIndex((p) => p.id === product.id);
          if (index > -1) {
            this.products.splice(index, 1);
          }
        });
      });
  }
}
