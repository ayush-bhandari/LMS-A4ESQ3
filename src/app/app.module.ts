import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule} from '@angular/forms';

import { 
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule
  } from '@angular/material';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { 
  BooksComponent,
  DeleteBook, 
  AddNewBook, 
  EditBook 
} from './books/books.component';

import { 
  StudentsComponent,
  DeleteStudents, 
  AddNewStudent, 
  EditStudent 
} from './students/students.component';

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
    DeleteBook, 
    AddNewBook, 
    EditBook,
    StudentsComponent,
    DeleteStudents,
    AddNewStudent,
    EditStudent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule, 
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  entryComponents:[
    DeleteBook, 
    AddNewBook, 
    EditBook,
    DeleteStudents,
    AddNewStudent,
    EditStudent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
