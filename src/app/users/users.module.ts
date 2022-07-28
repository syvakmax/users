import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { SharedModule } from '../shared/shared.module';
import { FormComponent } from './form/form.component';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';

import { ReactiveFormsModule } from '@angular/forms';
import { UserDetailsComponent } from './user-details/user-details.component';

import {RouterModule} from '@angular/router';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';


@NgModule({
  declarations: [
    UsersListComponent,
    AddUserModalComponent,
    FormComponent,
    UserDetailsComponent,
    EditUserModalComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  exports: [
    UsersListComponent,
    AddUserModalComponent,
    UserDetailsComponent,
    EditUserModalComponent,
    RouterModule
  ]
})
export class UsersModule { }
