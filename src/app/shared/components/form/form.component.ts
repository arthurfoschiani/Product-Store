import { ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  productsService = inject(ProductsService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  product = input<Product | null>(null);

  form!: FormGroup;

  @Output() done = new EventEmitter();
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl<string>(this.product()?.title ?? '', {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  ngAfterViewInit(): void {
    if (this.titleInput) {
      const inputElement = this.titleInput.nativeElement;
      const valueLength = inputElement.value.length;

      inputElement.focus();
      inputElement.setSelectionRange(0, valueLength);
      this.cdr.detectChanges();
    }
  }

  onSubmit(): void {
    const product = this.form.value as Product;
    this.done.emit(product);
  }
}
