import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-content',
  imports: [
    RouterOutlet
  ],
  templateUrl: './content.html',
  styleUrl: './content.css',
})
export class Content {

}
