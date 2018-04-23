import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject, NgZone } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

declare let electron: any;

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
	
    public ipc = electron.ipcRenderer;

    displayedColumns = ['id','member_id', 'student_name', 'student_class', 'student_rollno','edit_delete'];
    dataSource = new MatTableDataSource();

  	@ViewChild(MatPaginator) paginator: MatPaginator;

  	constructor(
        public dialog: MatDialog,
        private zone: NgZone,
        private ref: ChangeDetectorRef
      ) { }

    tick() {
      this.ref.detectChanges();
    }

  	ngOnInit() {
  		this.ipc.send("studentsRead");
      this.ipc.on("studentsReadResult", (e,d) => {
        this.dataSource = d;
        this.zone.run(()=>this.tick());
      });
  	}

      
    ngAfterViewInit() {
    	this.dataSource.paginator = this.paginator;
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
      // this.zone.run(()=>this.tick());
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
    this.ipc.on("studentsDeleteResult", (e) => {
        
    });
    this.dialogRef.close();
  }
}