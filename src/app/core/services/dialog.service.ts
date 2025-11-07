import {inject, Injectable} from '@angular/core';
import {ConfirmationService} from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private confirmationService = inject(ConfirmationService);

  private get defaultConfirmConfig() {
    return {
      header: 'Confirmación',
      closable: false,
      closeOnEscape: false,
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary'
      },
      acceptButtonProps: {
        label: 'Aceptar'
      }
    };
  }

  public confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        ...this.defaultConfirmConfig,
        message,
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

}
