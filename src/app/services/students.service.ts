import { Injectable } from '@angular/core';

declare let electron: any;

@Injectable()
export class StudentsService {

	public ipc = electron.ipcRenderer;

  constructor() { }
  
  getStudent(){
  	this.ipc.send("studentsRead")
    // this.ipc.on("studentsReadResult", function (evt, students) {
    //   	// return students;
    //   	console.log(students);
    // });
    this.ipc.on("studentsReadResult").then(function(err,res){
    	console.log(res);
    });
  }

}
