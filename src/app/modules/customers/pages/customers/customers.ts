import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Customer} from '../../models/customer.model';
import {CustomersService} from '../../services/customers.service';
import {Subscription} from 'rxjs';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Dialog} from 'primeng/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {DialogService} from '../../../../core/services/dialog.service';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {ToastService} from '../../../../core/services/toast-service';

@Component({
  selector: 'app-customers',
  imports: [
    TableModule,
    DatePipe,
    Button,
    Card,
    Dialog,
    ReactiveFormsModule,
    InputText,
    Password,
    IconField,
    InputIcon
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit, OnDestroy {

  private customerService = inject(CustomersService);
  private dialogService = inject(DialogService);
  private toastService = inject(ToastService);


  private getAllSub: Subscription | undefined;
  private saveSub: Subscription | undefined;
  private deleteSub: Subscription | undefined;

  protected customers = signal<Customer[]>([]);
  protected currentUserId: number = 0;
  protected title: string = 'Crear usuario';
  protected visible: boolean = false;

  protected customerForm = new FormGroup({
    'firstName': new FormControl('', [Validators.required, Validators.maxLength(20)]),
    'lastName': new FormControl('', [Validators.required, Validators.maxLength(20)]),
    'address': new FormControl('', [Validators.required, Validators.maxLength(50)]),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required, Validators.maxLength(20)]),
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
    this.getAllSub = this.customerService.getAll().subscribe(
      resp => {
        this.customers.set(resp);
      }
    );
  }

  protected onSubmit() {
    if (!this.customerForm.invalid) {
      const customer: Customer = {
        id: this.currentUserId,
        firstName: this.customerForm.get('firstName')?.value ?? '',
        lastName: this.customerForm.get('lastName')?.value ?? '',
        address: this.customerForm.get('address')?.value ?? '',
        email: this.customerForm.get('email')?.value ?? '',
        password: this.customerForm.get('password')?.value ?? '',
        createdAt: new Date()
      }

      this.saveSub = this.customerService.save(customer).subscribe(
        resp => {
          const message = this.currentUserId == 0
            ? 'Usuario agregado exitosamente'
            : 'Usuario actualizado exitosamente';

          this.toastService.showSuccess(message);
          this.visible = false;
          this.loadData();
        }
      )
    }
  }

  protected onHide(){
    this.customerForm.reset();
  }

  protected onAdd() {
    this.title = 'Crear usuario';
    this.currentUserId = 0;
    this.visible = true;
  }

  protected onEdit(customer: Customer) {
    this.title = 'Editar usuario';
    this.currentUserId = customer.id;
    this.customerForm.patchValue(customer);
    this.visible = true;
  }

  protected async onDelete(customer: Customer) {
    const message = `¿Desea eliminar usuario ${customer.firstName} ${customer.lastName}?`;
    const canContinue = await this.dialogService.confirm(message);

    if (canContinue) {
      this.deleteSub = this.customerService.delete(customer.id).subscribe(
        () => {
          this.toastService.showSuccess('Usuario eliminado exitosamente');
          this.loadData();
        }
      )
    }
  }

}
