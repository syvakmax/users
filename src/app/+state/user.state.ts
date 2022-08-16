import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';
import { IUser } from '../users/users';
import { LoadAllUsers, SetPage } from './user.actions';
import { patch } from '@ngxs/store/operators';

export interface UsersStateModel {
  users: IUser[];
  limit: number;
  page: number;
  order: string;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [],
    limit: 3,
    page: 1,
    order: '1',
  },
})
@Injectable({ providedIn: 'root' })
export class UserState {
  @Selector()
  static getAllItems(state: UsersStateModel) {
    return state.users;
  }

  @Selector()
  static getAllItemsOrdered(state: UsersStateModel) {
    const users = [...state.users];
    const sortedUser = users.sort((a, b) => {
      if (state.order === '1') {
        return b.id - a.id;
      } else {
        return a.id - b.id;
      }
    });

    return sortedUser;
  }

  @Selector([UserState.getAllItemsOrdered])
  static getItems(state: UsersStateModel, sortedUser: IUser[]) {
    return sortedUser.slice(
      state.page * state.limit - state.limit,
      state.page * state.limit
    );
  }

  constructor(private userService: UserService) {}

  @Action(LoadAllUsers)
  loadAllUsers(ctx: StateContext<UsersStateModel>) {
    return this.userService.getAllUsers().pipe(
      map((users) => {
        ctx.setState({
          ...ctx.getState(),
          users,
        });
      })
    );
  }

  @Action(SetPage)
  setPage(ctx: StateContext<UsersStateModel>, action: SetPage) {
    ctx.setState(
      patch({
        page: action.page,
      })
    );
  }
}
