export class LoadAllUsers {
  static readonly type = '[Users] Load all users';
}

export class SetPage {
  static readonly type = '[Users] set page';
  constructor(public page: number) {}
}

export class SetOrder {
  static readonly type = '[Users] set order';
  constructor(public order: string) {}
}
