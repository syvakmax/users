import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { IUser } from '../users';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user: IUser | undefined

  id = ''

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private modal: ModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const userIdFromRoute = routeParams.get('id');

    if (userIdFromRoute) {
      this.userService.getUserById(userIdFromRoute).subscribe(
        user => this.user = user
      )
    }
    
  }

  editUserModal($event: Event) {
    $event.preventDefault()
    this.modal.toggleModal('edit-user')
  }

  deleteUser($event: Event) {
    $event.preventDefault()
    if (this.user) {
      this.userService.deleteUser(this.user)
      this.router.navigateByUrl('')
    }
  }

}
