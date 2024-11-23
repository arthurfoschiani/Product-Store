import { Product } from '../../shared/interfaces/product.interface';
import { ProductsService } from './../../shared/services/products.service';
import { Component, inject, signal } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';
import { NoItemsComponent } from './components/no-items/no-items.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent, RouterLink, MatButtonModule, NoItemsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  products = signal<Product[]>(
    inject(ActivatedRoute).snapshot.data['products']
  );

  productsService = inject(ProductsService);
  confirmationDialogComponent = inject(ConfirmationDialogService);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);

  onEdit(product: Product) {
    this.router.navigate(['/edit-product', product.id]);
  }

  onDelete(product: Product) {
    this.confirmationDialogComponent
      .openDialog()
      .pipe(filter((answer) => answer))
      .subscribe(() => {
        this.productsService.delete(product.id).subscribe(() => {
          this.products.update((currentProducts) =>
            currentProducts.filter((p) => p.id !== product.id)
          );
          this.matSnackBar.open('Produto deletado com sucesso!', 'Ok');
        });
      });
  }
}
