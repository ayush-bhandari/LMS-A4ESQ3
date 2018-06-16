import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  MatPaginator,
  MatTableDataSource,
  MatDialog, 
  MatDialogRef, 
  MAT_DIALOG_DATA 
} from '@angular/material';
import * as moment from 'moment';

declare let electron: any;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
	public ipc = electron.ipcRenderer;

	displayedColumns = ['id','book_id', 'book_title', 'book_author', 'book_shelf','edit_delete'];
    dataSource: MatTableDataSource<BookData>;

  	@ViewChild(MatPaginator) public paginator: MatPaginator;

	constructor(
		public dialog: MatDialog,
        private zone: NgZone,
        private ref: ChangeDetectorRef
	) { }

	tick() {
      if(!this.ref['destroyed']){
        this.ref.detectChanges();  
      }    
    }

    paginatorCall (){
      this.dataSource.paginator = this.paginator;
    }

	ngOnInit() {
		this.ipc.send("booksRead");
	    this.ipc.on("booksReadResult", (e,d) => {
	       	this.dataSource = new MatTableDataSource(d);
	       	this.zone.run(()=>this.paginatorCall());
	       	this.zone.run(()=>this.tick());
	    });
	}

	applyFilter(filterValue: string) {
	    filterValue = filterValue.trim(); // Remove whitespace
	    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
	    this.dataSource.filter = filterValue;
	}

	deleteBook(book) : void {
	    let dialogRef = this.dialog.open(DeleteBook, {
	      width: '500px',
	      data: { book: book }
	    });

	    dialogRef.afterClosed().subscribe(() => {
	      this.ngOnInit();
	    });
	}
	  
	addNewBook() : void {
	    let dialogRef = this.dialog.open(AddNewBook, {
	      width: '500px'
	    });

	    dialogRef.afterClosed().subscribe(() => {
	      this.ngOnInit();
	    });
	}

	editBook(book) : void {
	    let dialogRef = this.dialog.open(EditBook, {
	      width: '500px',
	      data: { book: book }
	    });

	    dialogRef.afterClosed().subscribe(() => {
	      this.ngOnInit();
	    });
	 }

}

@Component({
  selector: 'delete-book',
  templateUrl: './delete-book.html'
})
export class DeleteBook {

  constructor(
      public dialogRef: MatDialogRef<DeleteBook>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private zone: NgZone
    ) { }

  public book = this.data.book;
  public ipc = electron.ipcRenderer;
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.zone.run(()=>{
      this.ipc.send("bookDelete",this.book);
      this.ipc.on("bookDeleteResult", (e) => {});
    });
    
    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-new-book',
  templateUrl: './add-new-book.html'
})
export class AddNewBook implements OnInit{
  
  addNewBookForm : FormGroup;

  constructor(
      public dialogRef: MatDialogRef<AddNewBook>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private zone: NgZone
    ) { }

  public ipc = electron.ipcRenderer;
  
  ngOnInit() {
    this.addNewBookForm = this.fb.group({
      book_id:['',[
        Validators.required
      ]],
      book_title:['',[
        Validators.required
      ]],
      book_author:['',[
        Validators.required
      ]],
      book_isbn:['',[
        Validators.required
      ]],
      book_category:['',[
        Validators.required
      ]],
      book_language:['',[
        Validators.required
      ]],
      book_publisher:['',[
        Validators.required
      ]],
      book_year:['',[
        Validators.required
      ]],
      book_price:['',[
        Validators.required
      ]],
      book_pages:['',[
        Validators.required
      ]],
      book_shelf:['',[
        Validators.required
      ]],
      created_date: moment().format(),
      modified_date: moment().format()
    })
  }

  get book_id() {
    return this.addNewBookForm.get('book_id');
  }
  get book_title() {
    return this.addNewBookForm.get('book_title');
  }
  get book_author() {
    return this.addNewBookForm.get('book_author');
  }
  get book_isbn() {
    return this.addNewBookForm.get('book_isbn');
  }
  get book_category() {
    return this.addNewBookForm.get('book_category');
  }
  get book_language() {
    return this.addNewBookForm.get('book_language');
  }
  get book_publisher() {
    return this.addNewBookForm.get('book_publisher');
  }
  get book_year() {
    return this.addNewBookForm.get('book_year');
  }
  get book_price() {
    return this.addNewBookForm.get('book_price');
  }
  get book_pages() {
    return this.addNewBookForm.get('book_pages');
  }
  get book_shelf() {
    return this.addNewBookForm.get('book_shelf');
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.zone.run(()=>{
      this.ipc.send("bookCreate",this.addNewBookForm.value);
      this.ipc.on("bookCreateResult", (e) => {});
      this.ipc.on("bookAlreadyExists", (e) => {
        alert("Oops, Looks like A Book with this BOOK ID Already exists.\nPlease create again with different and unique BOOK ID");
      });
    });
    this.dialogRef.close();
  }
}


@Component({
  selector: 'edit-book',
  templateUrl: './edit-book.html'
})
export class EditBook implements OnInit{
  
  editBookForm : FormGroup;

  constructor(
      public dialogRef: MatDialogRef<EditBook>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private zone: NgZone
    ) { }

  public ipc = electron.ipcRenderer;
  public book = this.data.book;

  ngOnInit() {
    this.editBookForm = this.fb.group({
      book_id:[{value:this.book.book_id,disabled:true},[
        Validators.required
      ]],
      book_title:[this.book.book_title,[
        Validators.required
      ]],
      book_author:[this.book.book_author,[
        Validators.required
      ]],
      book_isbn:[this.book.book_isbn,[
        Validators.required
      ]],
      book_category:[this.book.book_category,[
        Validators.required
      ]],
      book_language:[this.book.book_language,[
        Validators.required
      ]],
      book_publisher:[this.book.book_publisher,[
        Validators.required
      ]],
      book_year:[this.book.book_year,[
        Validators.required
      ]],
      book_price:[this.book.book_price,[
        Validators.required
      ]],
      book_pages:[this.book.book_pages,[
        Validators.required
      ]],
      book_shelf:[this.book.book_shelf,[
        Validators.required
      ]],
      created_date: this.book.created_date,
      modified_date: moment().format()
    })
  }

  get book_id() {
    return this.editBookForm.get('book_id');
  }
  get book_title() {
    return this.editBookForm.get('book_title');
  }
  get book_author() {
    return this.editBookForm.get('book_author');
  }
  get book_isbn() {
    return this.editBookForm.get('book_isbn');
  }
  get book_category() {
    return this.editBookForm.get('book_category');
  }
  get book_language() {
    return this.editBookForm.get('book_language');
  }
  get book_publisher() {
    return this.editBookForm.get('book_publisher');
  }
  get book_year() {
    return this.editBookForm.get('book_year');
  }
  get book_price() {
    return this.editBookForm.get('book_price');
  }
  get book_pages() {
    return this.editBookForm.get('book_pages');
  }
  get book_shelf() {
    return this.editBookForm.get('book_shelf');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.zone.run(()=>{
      this.ipc.send("bookEdit",this.editBookForm.getRawValue());
      this.ipc.on("bookEditResult", (e) => {});
    });
    this.dialogRef.close();
  }
}


export interface BookData {
  id: string;
  book_id: string;
  book_title: string;
  book_author: string;
  book_isbn: string;
  book_category: string;
  book_language: string;
  book_publisher: string;
  book_year: string;
  book_price: string;
  book_pages: string;
  book_shelf: string;
}
