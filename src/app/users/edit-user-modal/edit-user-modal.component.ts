import { InvokeFunctionExpr } from '@angular/compiler';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { IUser } from '../users';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit, OnChanges {

  @Input() activeUser: IUser | null = null
  @Output() editUser: EventEmitter<IUser> = new EventEmitter

  firstName = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(2)
    ],
    nonNullable: true
  })
  lastName = new FormControl('', [
    Validators.required,
    Validators.minLength(2)
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email,
    //Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
  ])
  birthDate = new FormControl('', [
    Validators.required
  ])
  role = new FormControl('', [
    Validators.required
  ])

  editForm = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    birthDate: this.birthDate,
    role: this.role,
  })

  inSubmission = false
  showAlert = false
  alertMsg = 'Please wait. Updating clip.'
  alertColor = 'blue'

  constructor(
    public modal: ModalService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.modal.register('edit-user')
  }

  ngOnChanges() {
    if (!this.activeUser) {
      return
    }
    this.firstName.setValue(this.activeUser.firstName)
    this.lastName.setValue(this.activeUser.lastName)
    this.email.setValue(this.activeUser.email)
    this.birthDate.setValue(this.activeUser.birthDate)
    this.role.setValue(this.activeUser.role)
  }

  async submit() {
    if (!this.activeUser) {
      return
    }
    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait. Updating user.'

    const updatedUser = {
      id: this.activeUser.id,
      firstName: this.firstName.value as string,
      lastName: this.lastName.value as string,
      email: this.email.value as string,
      birthDate: this.birthDate.value as string,
      role: this.role.value as string
    }
    try {
      await this.userService.updateUser(this.activeUser.id.toString(), updatedUser)
      this.editUser.emit(updatedUser)
    }
    catch (err) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = 'Something went wrong. Try again later'
      console.log(err)
      return
    }

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success!'

    setTimeout(() => {
      this.modal.toggleModal('edit-user')
    }, 1000)
    setTimeout(() => {
      this.router.navigate(['user', updatedUser.id])
    }, 1200)
  }

}
