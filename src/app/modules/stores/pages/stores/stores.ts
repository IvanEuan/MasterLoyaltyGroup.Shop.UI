import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Subscription} from 'rxjs';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Dialog} from 'primeng/dialog';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {DialogService} from '../../../../core/services/dialog.service';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {ToastService} from '../../../../core/services/toast-service';
import {StoreService} from '../../../../shared/stores/services/store.service';
import {Store} from '../../../../shared/stores/models/store.model';

@Component({
  selector: 'app-stores',
  imports: [
    Button,
    Card,
    DatePipe,
    Dialog,
    FormsModule,
    IconField,
    InputIcon,
    InputText,
    ReactiveFormsModule,
    TableModule
  ],
  templateUrl: './stores.html',
  styleUrl: './stores.css',
})
export class Stores implements OnInit, OnDestroy {

  private storeService = inject(StoreService);
  private dialogService = inject(DialogService);
  private toastService = inject(ToastService);


  private getAllSub: Subscription | undefined;
  private saveSub: Subscription | undefined;
  private deleteSub: Subscription | undefined;

  protected stores = signal<Store[]>([]);
  protected currentStoreId: number = 0;
  protected title: string = 'Agregar tienda';
  protected visible: boolean = false;

  protected storeForm = new FormGroup({
    'name': new FormControl('', [Validators.required, Validators.maxLength(30)]),
    'address': new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.getAllSub?.unsubscribe();
    this.saveSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  private loadData() {
    this.getAllSub = this.storeService.getAll().subscribe(
      resp => {
        this.stores.set(resp);
      }
    );
  }

  protected onSubmit() {
    if (!this.storeForm.invalid) {
      const store: Store = {
        id: this.currentStoreId,
        name: this.storeForm.get('name')?.value ?? '',
        address: this.storeForm.get('address')?.value ?? '',
        createdAt: new Date()
      }

      this.saveSub = this.storeService.save(store).subscribe(
        resp => {
          const message = this.currentStoreId == 0
            ? 'Tienda agregada exitosamente'
            : 'Tienda actualizada exitosamente';

          this.toastService.showSuccess(message);
          this.visible = false;
          this.loadData();
        }
      )
    }
  }

  protected onHide(){
    this.storeForm.reset();
  }

  protected onAdd() {
    this.title = 'Agregar tienda';
    this.currentStoreId = 0;
    this.visible = true;
  }

  protected onEdit(store: Store) {
    this.title = 'Editar tienda';
    this.currentStoreId = store.id;
    this.storeForm.patchValue(store);
    this.visible = true;
  }

  protected async onDelete(store: Store) {
    const message = `¿Desea dar de baja a la tienda ${store.name}?`;
    const canContinue = await this.dialogService.confirm(message);

    if (canContinue) {
      this.deleteSub = this.storeService.delete(store.id).subscribe(
        () => {
          this.toastService.showSuccess('Tienda dada de baja exitosamente');
          this.loadData();
        }
      )
    }
  }

}

