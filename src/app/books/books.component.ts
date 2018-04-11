import { Component, OnInit } from '@angular/core';
declare let electron: any;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
public ipc = electron.ipcRenderer;

  constructor() { }

  ngOnInit() {


  }

}
