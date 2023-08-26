import { IUser } from './users';

export interface ITurn {
    roomId: string;
    currentUser: IUser | null;
}
