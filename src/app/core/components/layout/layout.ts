import { Component } from '@angular/core';
import {Header} from '../header/header';
import {Content} from '../content/content';

@Component({
  selector: 'app-layout',
  imports: [
    Header,
    Content
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
