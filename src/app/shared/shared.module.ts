import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputComponent } from "./input/input.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ReactiveFormsModule } from "@angular/forms";
import { InputDateComponent } from "./input-date/input-date.component";
import { InputSelectComponent } from "./input-select/input-select.component";
import { MatSelectModule } from "@angular/material/select";
import { AlertComponent } from "./alert/alert.component";

@NgModule({
  declarations: [
    InputComponent,
    InputDateComponent,
    InputSelectComponent,
    AlertComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  exports: [
    InputComponent,
    InputDateComponent,
    InputSelectComponent,
    AlertComponent,
  ],
})
export class SharedModule {}
