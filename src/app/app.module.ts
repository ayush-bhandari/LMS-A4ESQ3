import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { 
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatDialogModule 
  } from '@angular/material';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BooksComponent } from './books/books.component';
import { StudentsComponent, DeleteStudents, AddNewStudent } from './students/students.component';

const appRoutes: Routes = [
	{path:'dashboard', component:DashboardComponent},
	{path:'books', component:BooksComponent},
	{path:'students', component:StudentsComponent},
	{path:'', redirectTo: '/dashboard', pathMatch: 'full'},
	{path:'**', redirectTo: '/dashboard'}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BooksComponent,
    StudentsComponent,
    DeleteStudents,
    AddNewStudent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule, 
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  entryComponents:[
    DeleteStudents,
    AddNewStudent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
