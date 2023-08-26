import { IAction } from './actions';
import { IUser } from './users';

export interface ITurn {
    roomId: string;
    currentUser: IUser | null;
    currentAction: {
        action: IAction;
        message: string;
        countSkipped: number;
    } | null;
    customTitle?: string;
}
