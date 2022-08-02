import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable, map, BehaviorSubject, switchMap, combineLatest } from 'rxjs';
import { users, IUser } from '../users/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: IUser[] = []

  private usersCollection: AngularFirestoreCollection<IUser>
  users$: Observable<IUser[]>

  constructor(
    private readonly db: AngularFirestore
  ) {
    this.usersCollection = db.collection<IUser>('users');
    this.users$ = this.usersCollection.valueChanges();
  }

  getAllUsers() {
    return this.users$
  }

  getUsersSorted(sort$: BehaviorSubject<string>, numUsersLoaded$: BehaviorSubject<number>, 
                  loadLimit: number, lastUserId$: BehaviorSubject<number>) {
    return combineLatest([
      sort$,
      numUsersLoaded$,
      lastUserId$
    ]).pipe(
      switchMap(values => {
        const [sort, numUsersLoaded, lastUserId] = values

        // let query = this.usersCollection.ref.orderBy(
        //   'id', sort === '1' ? 'desc' : 'asc'
        // );

        // if (numUsersLoaded > loadLimit) {
        //   query = query.startAfter(lastUserId)
        // };

        // query = query.limit(loadLimit);

        // return query.get();

        // const query = this.usersCollection.ref.orderBy(
        //   'id', sort === '1' ? 'desc' : 'asc'
        // ).startAt(0).limit(loadLimit);
        // return query.get();

        if (numUsersLoaded <= loadLimit) {
          const query = this.usersCollection.ref.orderBy(
            'id', sort === '1' ? 'desc' : 'asc'
          ).limit(loadLimit)
          return query.get()
        } else {
          const query = this.usersCollection.ref.orderBy(
            'id', sort === '1' ? 'desc' : 'asc'
          ).startAfter(lastUserId).limit(loadLimit)
          return query.get()
        }
      }),
      map(snapshot => {
        return (snapshot as QuerySnapshot<IUser>).docs
      })
    )
  }

  getUserById(id: string) {
    return this.usersCollection.doc(id).snapshotChanges().pipe(
      map(snapshot => snapshot.payload.data())
    )
  }

  updateUser(id: string, updatedUser: IUser) {
    return this.usersCollection.doc(id).update({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      birthDate: updatedUser.birthDate,
      role: updatedUser.role
    })
  }

  async deleteUser(user: IUser) {
    await this.usersCollection.doc(user.id.toString()).delete()
  }

}
