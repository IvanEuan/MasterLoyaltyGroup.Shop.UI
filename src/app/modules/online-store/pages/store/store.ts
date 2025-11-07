import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Product} from '../../../../shared/products/models/product.model';
import {ProductService} from '../../../../shared/products/services/product.service';
import {Subscription} from 'rxjs';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {CurrencyPipe} from '@angular/common';
import {Drawer} from 'primeng/drawer';
import {ProductCart} from '../../models/cart-model-ts';
import {ToastService} from '../../../../core/services/toast-service';
import {DialogService} from '../../../../core/services/dialog.service';
import {OnlineShop} from '../../services/online-shop';

@Component({
  selector: 'app-store',
  imports: [
    Card,
    Button,
    CurrencyPipe,
    Drawer
  ],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store implements OnInit, OnDestroy {

  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private messageService = inject(DialogService);
  private shopService = inject(OnlineShop);

  protected products = signal<Product[]>([]);
  protected productsCart = signal<ProductCart[]>([]);
  protected total = signal<number>(0);
  protected productCount: string = '0';
  protected showCart: boolean = false;

  private getllProductsSub: Subscription | undefined;

  ngOnInit(): void {
    this.getllProductsSub = this.productService.getAll().subscribe(
      products => {
        this.products.set(products);
      }
    )
  }

  ngOnDestroy(): void {
    this.getllProductsSub?.unsubscribe();
  }

  protected onAddToCart(product: Product){

    if (!this.productsCart().find(x => x.productId == product.id)) {

     this.productsCart().push({
       productId: product.id,
       productName: product.description,
       productPrice: product.price
     });

     this.productCount = this.productsCart().length.toString();
     const total = this.total() + product.price;
     this.total.set(total);

      this.toastService.showSuccess('Producto agregado al carrito');
    }
    else {
      this.toastService.showWarn('Este producto ya ha sido agregado al carrito');
    }

  }

  protected onDelete(product: ProductCart) {

    const products = this.productsCart()
      .filter(x => x.productId != product.productId)

    this.productsCart.set(products);
    this.total.set(this.total() - product.productPrice);
    this.productCount = this.productsCart().length.toString();

  }

  public async onSubmit() {

    const canContinue = await this.messageService.confirm('¿Desea proceder con la compra?');
    if (canContinue) {

      const products = this.productsCart().map((x) => x.productId);

      this.shopService.save(products).subscribe(resp => {
        this.toastService.showSuccess('Compra realizada com éxito');
        this.productsCart.set([]);
        this.total.set(0);
        this.productCount = '0';
      })

    }
  }

}
