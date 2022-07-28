import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

import { users, IUser } from '../users';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: IUser[] = []
  loadLimit = 12
  numUsersLoaded = this.loadLimit

  activeUser: IUser | null = null

  sort$: BehaviorSubject<string>
  numUsersLoaded$: BehaviorSubject<number>
  lastUserId$: BehaviorSubject<number>

  constructor(
    private modal: ModalService,
    private userService: UserService
  ) {
    this.sort$ = new BehaviorSubject('1')
    this.numUsersLoaded$ = new BehaviorSubject(this.loadLimit)
    this.lastUserId$ = new BehaviorSubject(0)
   }

  ngOnInit(): void {
    /*this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users
        console.log(this.users)
      }
    })
    //Works with the following condition:
    //let user of users | slice:0:numUsersLoaded
    
    this.userService.getUsersSorted(this.sort$, this.numUsersLoaded$).subscribe(docs => {
      this.users = []

      docs.forEach(doc => {
        this.users.push(doc.data())
      })
    })
    */

    this.userService.getUsersSorted2(
        this.sort$, this.numUsersLoaded$, 
        this.loadLimit, this.lastUserId$
      ).subscribe(docs => {
      docs.forEach(doc => {
        this.users.push(doc.data())
      })
    })
  }

  addUserModal($event: Event) {
    $event.preventDefault()

    this.modal.toggleModal('add-user')
  }

  editUserModal($event: Event, user: IUser) {
    $event.preventDefault()
    this.activeUser = user
    this.modal.toggleModal('edit-user')
  }

  deleteUser($event: Event, user: IUser) {
    $event.preventDefault()

    this.userService.deleteUser(user)

    this.users.forEach((u, i)=> {
      if (u.id === user.id) {
        this.users.splice(i, 1)
        this.numUsersLoaded -= 1
      }
    })
  }

  loadMore() {
    this.lastUserId$.next(this.users[this.numUsersLoaded - 1].id)
    this.numUsersLoaded += 6
    this.numUsersLoaded$.next(this.numUsersLoaded)
  }

}
