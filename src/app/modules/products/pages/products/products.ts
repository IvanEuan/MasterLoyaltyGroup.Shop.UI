import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {Dialog} from "primeng/dialog";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TableModule} from "primeng/table";
import {InputNumber} from 'primeng/inputnumber';
import {MultiSelect} from 'primeng/multiselect';
import {DialogService} from '../../../../core/services/dialog.service';
import {ToastService} from '../../../../core/services/toast-service';
import {Subscription} from 'rxjs';
import {Customer} from '../../../customers/models/customer.model';
import {ProductService} from '../../../../shared/products/services/product.service';
import {StoreService} from '../../../../shared/stores/services/store.service';
import {Product} from '../../../../shared/products/models/product.model';
import {Store} from '../../../../shared/stores/models/store.model';

@Component({
  selector: 'app-products',
  imports: [
    Button,
    Card,
    DatePipe,
    Dialog,
    IconField,
    InputIcon,
    InputText,
    ReactiveFormsModule,
    TableModule,
    InputNumber,
    MultiSelect,
    CurrencyPipe
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit, OnDestroy {

  private productService = inject(ProductService);
  private storeService = inject(StoreService);

  private dialogService = inject(DialogService);
  private toastService = inject(ToastService);

  private getAllSub: Subscription | undefined;
  private getAllStoresSub: Subscription | undefined;
  private saveSub: Subscription | undefined;
  private deleteSub: Subscription | undefined;

  protected products = signal<Product[]>([]);
  protected stores: Store[] = [];

  protected currentProductId: number = 0;
  protected title: string = 'Agregar producto';
  protected visible: boolean = false;

  protected productForm = new FormGroup({
    'code': new FormControl('', [Validators.required, Validators.maxLength(15)]),
    'description': new FormControl('', [Validators.required, Validators.maxLength(50)]),
    'image': new FormControl('', [Validators.required, Validators.maxLength(150)]),
    'price': new FormControl<number>(0, [Validators.required]),
    'stock': new FormControl<number>(0, [Validators.required]),
    'storeAccess': new FormControl<number[]>([], [Validators.required])
  });

  ngOnInit(): void {
    this.loadData();
    this.loadStores();
  }

  ngOnDestroy(): void {
    this.getAllSub?.unsubscribe();
    this.getAllStoresSub?.unsubscribe();
    this.saveSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  private loadData() {
    this.getAllSub = this.productService.getAll().subscribe(
      resp => {
        this.products.set(resp);
      }
    );
  }

  private loadStores() {
    this.getAllStoresSub = this.storeService.getAll().subscribe(
      resp => {
        this.stores = resp;
      }
    );
  }

  protected onSubmit() {

    if (!this.productForm.invalid) {

      const productStores = (this.productForm.get('storeAccess')?.value ?? []).map(
        (value) => (
          {
            id: 0,
            storeId: value,
            productId: this.currentProductId,
            createdAt: new Date(),
          })
      );

      const product: Product = {
        id: this.currentProductId,
        code: this.productForm.get('code')?.value ?? '',
        description: this.productForm.get('description')?.value ?? '',
        image: this.productForm.get('image')?.value ?? '',
        price: this.productForm.get('price')?.value ?? 0,
        stock: this.productForm.get('stock')?.value ?? 0,
        createdAt: new Date(),
        stores: productStores,
      };

      this.saveSub = this.productService.save(product).subscribe(
        resp => {
          const message = this.currentProductId == 0
            ? 'Producto agregado exitosamente'
            : 'Producto actualizado exitosamente';

          this.toastService.showSuccess(message);
          this.visible = false;
          this.loadData();
        }
      )
    }
  }

  protected onHide(){
    this.productForm.reset();
  }

  protected onAdd() {
    this.title = 'Agregar producto';
    this.currentProductId = 0;
    this.visible = true;
  }

  protected onEdit(product: Product) {
    this.title = 'Editar producto';
    this.currentProductId = product.id;
    this.productForm.patchValue(product);
    this.productForm.get('storeAccess')?.setValue(product.stores.map(x => x.storeId));
    this.visible = true;
  }

  protected async onDelete(product: Product) {
    const message = `¿Desea eliminar el producto ${product.description}?`;
    const canContinue = await this.dialogService.confirm(message);

    if (canContinue) {
      this.deleteSub = this.productService.delete(product.id).subscribe(
        () => {
          this.toastService.showSuccess('Producto eliminado exitosamente');
          this.loadData();
        }
      )
    }
  }
}
