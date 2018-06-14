import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import * as moment from 'moment';

declare let electron: any;

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
	
    public ipc = electron.ipcRenderer;
    // public studentAlreadyExistsError = true;
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
      // this.zone.run(()=>{
      //   this.studentAlreadyExistsError = true;
      //   this.ipc.on("studentAlreadyExists", (e) => {
      //     console.log(this.studentAlreadyExistsError);
      //     this.studentAlreadyExistsError = false;
      //     console.log(this.studentAlreadyExistsError);
      //     setTimeout(function(){ this.studentAlreadyExistsError=true;console.log(this.studentAlreadyExistsError);}, 5000);
      //   });
      // })
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
    // let loading = false;
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
      @Inject(MAT_DIALOG_DATA) public data: any,
      private zone: NgZone
    ) { }

  public student = this.data.student;
  public ipc = electron.ipcRenderer;
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    // console.log(this.loading);
    // this.loading = true;
    // console.log(this.loading);
    this.zone.run(()=>{
      this.ipc.send("studentsDelete",this.student);
      this.ipc.on("studentsDeleteResult", (e) => {
        // setTimeout(function(){ this.loading=false; console.log(this.loading);}, 5000);
        // console.log(this.loading);
        // this.dialogRef.close();
      });
    });
    
    this.dialogRef.close();
  }
}

// export class StudentErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

// export class StudentsFormData {
//   constructor(
//     public member_id: string,
//     public student_name: string,
//     public student_class: string,
//     public student_rollno: string,
//     public created_date?: string,
//     public modified_date?: string
//   ) {}
// }

@Component({
  selector: 'add-new-student',
  templateUrl: './add-new-student.html'
})
export class AddNewStudent implements OnInit{
  
  // student = new StudentsFormData(null,null,null,null);
  addNewStudentForm : FormGroup;

  constructor(
      public dialogRef: MatDialogRef<AddNewStudent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private zone: NgZone
    ) { }

  public ipc = electron.ipcRenderer;
  
  ngOnInit() {
    this.addNewStudentForm = this.fb.group({
      member_id:['',[
        Validators.required
      ]],
      student_name:['',[
        Validators.required
      ]],
      student_class:['',[
        Validators.required
      ]],
      student_rollno:['',[
        Validators.required
      ]],
      created_date: moment().format(),
      modified_date: moment().format()
    })
  }

  get member_id() {
    return this.addNewStudentForm.get('member_id');
  }
  get student_name() {
    return this.addNewStudentForm.get('student_name');
  }
  get student_class() {
    return this.addNewStudentForm.get('student_class');
  }
  get student_rollno() {
    return this.addNewStudentForm.get('student_rollno');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
   this.zone.run(()=>{
    this.ipc.send("studentsCreate",this.addNewStudentForm.value);
    
    this.ipc.on("studentsCreateResult", (e) => { 
      // this.dialogRef.close(); 
    });
    
    this.ipc.on("studentAlreadyExists", (e) => {
      // <p class="error-message-header">
      //   <span [(hidden)]="studentAlreadyExistsError">Oops, Looks like A student with same <strong>MEMBER ID</strong> Already exists. Please create again with different and unique <strong>MEMBER ID</strong></span>
      // </p>
      // console.log("studentAlreadyExistsError");
      // this.dialogRef.close();
      alert("Oops, Looks like A student with this MEMBER ID Already exists.\nPlease create again with different and unique MEMBER ID");
      // this.dialogRef.close();
      // if (confirm("Oops, Student already exists.\nPlease create again with different and unique MEMBER ID")) {
      //   this.dialog.open(AddNewStudent, {
      //      width: '500px'
      //    });
      // } else {
      //   this.dialogRef.close();
      // }
    });
    // console.log(this.addNewStudentForm.value);
    // console.log(JSON.stringify(this.student));
    // console.log(this.student);
  });
    this.dialogRef.close();
  }

  // studentMemberIDFormControl = new FormControl('', [
  //   Validators.required
  // ]);
  // studentNameFormControl = new FormControl('', [
  //   Validators.required
  // ]);
  // studentClassFormControl = new FormControl('', [
  //   Validators.required
  // ]);
  // studentRollNoFormControl = new FormControl('', [
  //   Validators.required
  // ]);

  // matcher = new StudentErrorStateMatcher();

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