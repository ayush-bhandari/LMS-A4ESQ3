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

  editStudent(student) : void {
    let dialogRef = this.dialog.open(EditStudent, {
      width: '500px',
      data: { student: student }
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
    this.zone.run(()=>{
      this.ipc.send("studentsDelete",this.student);
      this.ipc.on("studentsDeleteResult", (e) => {});
    });
    
    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-new-student',
  templateUrl: './add-new-student.html'
})
export class AddNewStudent implements OnInit{
  
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
      this.ipc.on("studentsCreateResult", (e) => {});
      this.ipc.on("studentAlreadyExists", (e) => {
        alert("Oops, Looks like A student with this MEMBER ID Already exists.\nPlease create again with different and unique MEMBER ID");
      });
    });
    this.dialogRef.close();
  }
}



@Component({
  selector: 'edit-student',
  templateUrl: './edit-student.html'
})
export class EditStudent implements OnInit{
  
  editStudentForm : FormGroup;

  constructor(
      public dialogRef: MatDialogRef<EditStudent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private zone: NgZone
    ) { }

  public ipc = electron.ipcRenderer;
  public student = this.data.student;

  ngOnInit() {
    this.editStudentForm = this.fb.group({
      member_id:[{value:this.student.member_id,disabled:true},[
        Validators.required
      ]],
      student_name:[this.student.student_name,[
        Validators.required
      ]],
      student_class:[this.student.student_class,[
        Validators.required
      ]],
      student_rollno:[this.student.student_rollno,[
        Validators.required
      ]],
      created_date: this.student.created_date,
      modified_date: moment().format()
    })
  }

  get member_id() {
    return this.editStudentForm.get('member_id');
  }
  get student_name() {
    return this.editStudentForm.get('student_name');
  }
  get student_class() {
    return this.editStudentForm.get('student_class');
  }
  get student_rollno() {
    return this.editStudentForm.get('student_rollno');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.zone.run(()=>{
      this.ipc.send("studentEdit",this.editStudentForm.getRawValue());
      this.ipc.on("studentEditResult", (e) => {});
    });
    this.dialogRef.close();
  }
}

export interface StudentData {
  id: string;
  member_id: string;
  student_name: string;
  student_class: string;
  student_rollno: string;
}
