export class NoGroupError extends Error { }

export class NotUniqueGroupError extends Error { }

export class NoUsersToAddError extends Error {
  // eslint-disable-next-line no-unused-vars
  constructor(public readonly notExistingUsersIds: number[]) {
    super();
  }
}
