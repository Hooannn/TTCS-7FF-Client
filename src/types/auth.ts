export interface IUser {
  userId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  address?: string;
  phoneNumber?: string;
  avatar?: string;
  role: IRole;
  createdAt: string;
}

export type IRole = 'User' | 'Staff' | 'Admin';
