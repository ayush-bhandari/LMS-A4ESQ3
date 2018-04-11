import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, MatInputModule, MatFormFieldModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BooksComponent } from './books/books.component';
import { StudentsComponent } from './students/students.component';
import { StudentsService } from './services/students.service'

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
    StudentsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule, 
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [StudentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
