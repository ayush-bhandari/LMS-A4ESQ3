import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

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

  	constructor(private ref: ChangeDetectorRef) { }

  	ngOnInit() {
  		this.ipc.send("studentsRead");
    	this.ipc.on("studentsReadResult", this.StudentsRead.bind(this));
  	}
  
    StudentsRead(e,d){
  		this.dataSource.data = d;
      this.ref.detectChanges();
  	}
  
    ngAfterViewInit() {
    	this.dataSource.paginator = this.paginator;
  	}
	
	applyFilter(filterValue: string) {
	    filterValue = filterValue.trim(); // Remove whitespace
	    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
	    this.dataSource.filter = filterValue;
	}
  
}