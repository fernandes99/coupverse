import { ACTIONS } from '../../../../constants/actions';
import { S } from './styles';
import CoinImage from '../../../../assets/img/coin.png';
import { ITurn } from '../../../../types/turns';
import { IUser } from '../../../../types/users';
import { IAction } from '../../../../types/actions';
import { useMemo } from 'react';

interface IActionsBlock {
    turn: ITurn;
    userSelf: IUser;
    onAction: (actions: IAction) => void;
}

export const ActionsBlock = ({ turn, userSelf, onAction }: IActionsBlock) => {
    const isSelfTurn = useMemo(() => {
        return turn?.currentUser?.id === userSelf?.id;
    }, [turn, userSelf]);

    return (
        <S.Box>
            <S.ActionHead>
                {isSelfTurn ? (
                    <>
                        <h2>É sua vez!</h2>
                        <h3>Faça sua ação:</h3>
                    </>
                ) : (
                    <h2>Esperando a ação do {turn?.currentUser?.userName}...</h2>
                )}
            </S.ActionHead>

            {isSelfTurn && (
                <S.ActionList>
                    {ACTIONS.map((action) => (
                        <S.ActionItem key={action.slug} onClick={() => onAction(action)}>
                            <p>{action.title}</p>
                            <S.ActionMoney isNegative={action.transactionAmount < 0}>
                                <span>
                                    {action.transactionAmount > 0
                                        ? `+${action.transactionAmount}`
                                        : action.transactionAmount}
                                </span>
                                <img src={CoinImage} width={22} height={22} />
                            </S.ActionMoney>
                        </S.ActionItem>
                    ))}
                </S.ActionList>
            )}
        </S.Box>
    );
};
