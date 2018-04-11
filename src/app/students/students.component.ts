import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { StudentsService } from '../services/students.service'

// declare let electron: any;

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
	
   	public STUDENT_DATA = [];
	// public ipc = electron.ipcRenderer;

	displayedColumns = ['id','member_id', 'student_name', 'student_class', 'student_rollno','edit_delete'];
    dataSource = new MatTableDataSource(this.STUDENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private studentsService:StudentsService) { }

  ngOnInit() {
  	
	// this.studentsService.data.subscribe(newData => this.dataSource.data = newData);
		// this.dataSource.data = this.studentsService.getStudent();

		console.log(this.STUDENT_DATA);
		this.studentsService.getStudent();
		console.log(this.STUDENT_DATA);
  //   this.ipc.send("studentsRead")
  //   this.ipc.on("studentsReadResult", function (evt, students) {
  //     	console.log(students);      
		// this.STUDENT_DATA = students;		
		// this.studentsService.setData(students);
  //   });
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

// let STUDENT_DATA=[
// 	{id:1,member_id:23,student_name: "ram ds",student_class:"9",student_rollno:"23"},
// 	{id:2,member_id:24,student_name: "ram ds",student_class:"9",student_rollno:"2"},
// 	{id:3,member_id:25,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:4,member_id:225,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:5,member_id:235,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:6,member_id:255,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:7,member_id:265,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:8,member_id:275,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:9,member_id:285,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:10,member_id:825,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:11,member_id:425,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:12,member_id:525,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:13,member_id:295,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:14,member_id:925,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:15,member_id:8925,student_name: "ram ds",student_class:"9",student_rollno:"12"},
// 	{id:16,member_id:7235,student_name: "ram ds",student_class:"9",student_rollno:"12"}
// 	];
//  const STUDENT_DATA: Student[] = [
// 	{id:1,member_id:23,student_name: "ram ds",student_class:"9",student_rollno:"23"},
// 	{id:2,member_id:24,student_name: "ram ds",student_class:"9",student_rollno:"2"},
// 	{id:3,member_id:25,student_name: "ram ds",student_class:"9",student_rollno:"12"}
// 	];