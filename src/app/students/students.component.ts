import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject, NgZone } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';

declare let electron: any;

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
	
    public ipc = electron.ipcRenderer;
   
    displayedColumns = ['id','member_id', 'student_name', 'student_class', 'student_rollno','edit_delete'];
    dataSource: MatTableDataSource<StudentData>;

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
  		this.ipc.send("studentsRead");
      this.ipc.on("studentsReadResult", (e,d) => {
        this.dataSource = new MatTableDataSource(d);
        this.zone.run(()=>this.paginatorCall());
        this.zone.run(()=>this.tick());
      });
  	}

    // ngAfterViewInit() {
    //   console.log(this.dataSource);
    // 	this.dataSource.paginator = this.paginator;
    // }
	
	applyFilter(filterValue: string) {
	    filterValue = filterValue.trim(); // Remove whitespace
	    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
	    this.dataSource.filter = filterValue;
	}

  deleteStudents(student) : void {
    let dialogRef = this.dialog.open(DeleteStudents, {
      width: '500px',
      data: { student: student }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
  
  addNewStudent() : void {
    let dialogRef = this.dialog.open(AddNewStudent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

}


@Component({
  selector: 'delete-students',
  templateUrl: './delete-students.html'
})
export class DeleteStudents {

  constructor(
      public dialogRef: MatDialogRef<DeleteStudents>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  public student = this.data.student;
  public ipc = electron.ipcRenderer;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.ipc.send("studentsDelete",this.student);
    this.ipc.on("studentsDeleteResult", (e) => {});
    this.dialogRef.close();
  }
}

export class StudentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class StudentsFormData {
  constructor(
    public member_id: string,
    public student_name: string,
    public student_class: string,
    public student_rollno: string,
    public created_date?: string,
    public modified_date?: string
  ) {}
}

@Component({
  selector: 'add-new-student',
  templateUrl: './add-new-student.html'
})
export class AddNewStudent {
  
  student = new StudentsFormData(null,null,null,null);

  constructor(
      public dialogRef: MatDialogRef<AddNewStudent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  public ipc = electron.ipcRenderer;
  
  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(formm): void {
    // this.ipc.send("studentsDelete",this.student);
    // this.ipc.on("studentsDeleteResult", (e) => {});
    console.log(formm);
    // console.log(JSON.stringify(this.student));
    // console.log(this.student);
    this.dialogRef.close();
  }

  studentMemberIDFormControl = new FormControl('', [
    Validators.required
  ]);
  studentNameFormControl = new FormControl('', [
    Validators.required
  ]);
  studentClassFormControl = new FormControl('', [
    Validators.required
  ]);
  studentRollNoFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new StudentErrorStateMatcher();

}

export interface StudentData {
  id: string;
  member_id: string;
  student_name: string;
  student_class: string;
  student_rollno: string;
}

// import {Component} from '@angular/core';

// import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

// /** @title Input with a custom ErrorStateMatcher */
// @Component({
//   selector: 'input-error-state-matcher-example',
//   templateUrl: './input-error-state-matcher-example.html',
//   styleUrls: ['./input-error-state-matcher-example.css'],
// })
// export class InputErrorStateMatcherExample {
//   emailFormControl = new FormControl('', [
//     Validators.required,
//     Validators.email,
//   ]);

//   matcher = new MyErrorStateMatcher();
// }