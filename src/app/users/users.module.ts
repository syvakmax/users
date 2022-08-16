import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsersListComponent } from "./users-list/users-list.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AddUserModalComponent } from "./add-user-modal/add-user-modal.component";
import { SharedModule } from "../shared/shared.module";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";

import { ReactiveFormsModule } from "@angular/forms";
import { UserDetailsComponent } from "./user-details/user-details.component";

import { RouterModule } from "@angular/router";
import { EditUserModalComponent } from "./edit-user-modal/edit-user-modal.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { UserCardComponent } from "./user-card/user-card.component";
import { DeleteUserModalComponent } from "./delete-user-modal/delete-user-modal.component";
import { TopDomainsComponent } from './top-domains/top-domains.component';

@NgModule({
  declarations: [
    UsersListComponent,
    AddUserModalComponent,
    UserDetailsComponent,
    EditUserModalComponent,
    UserCardComponent,
    DeleteUserModalComponent,
    TopDomainsComponent,
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
    MatSelectModule,
    InfiniteScrollModule,
    MatDialogModule,
  ],
  exports: [
    UsersListComponent,
    AddUserModalComponent,
    UserDetailsComponent,
    EditUserModalComponent,
    RouterModule,
  ],
})
export class UsersModule {}
