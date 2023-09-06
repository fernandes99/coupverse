import { IAction, IChallangeAction, ICounterAction } from './actions';
import { IUser } from './users';

export interface ITurn {
    roomId: string;
    title: string;
    action: IAction | null;
    counterAction: ICounterAction | null;
    challangeAction: IChallangeAction | null;
    usersSkipped: string[];
    initialUser: IUser | null;
    currentUser: IUser | null;
    round: number;
    userSelected?: IUser;
}
