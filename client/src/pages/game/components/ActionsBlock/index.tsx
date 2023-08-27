import { ACTIONS } from '../../../../constants/actions';
import { S } from './styles';
import CoinImage from '../../../../assets/img/coin.png';
import { ITurn } from '../../../../types/turns';
import { IUser } from '../../../../types/users';
import { IAction } from '../../../../types/actions';
import { useEffect, useMemo, useState } from 'react';

const ACTION_TIME_DEFAULT = 10;

interface IActionsBlock {
    turn: ITurn;
    userSelf: IUser;
    onAction: (actions: IAction) => void;
    onSkip: () => void;
}

export const ActionsBlock = ({ turn, userSelf, onAction, onSkip }: IActionsBlock) => {
    const [secondsToAction, setSecondsToAction] = useState(ACTION_TIME_DEFAULT);
    const [skipped, setSkipped] = useState(false);
    const isSelfTurn = useMemo(() => {
        return turn?.currentUser?.id === userSelf?.id;
    }, [turn, userSelf]);

    const skip = () => {
        setSkipped(true);
        onSkip();
    };

    useEffect(() => {
        if (!turn.currentAction) {
            setSecondsToAction(ACTION_TIME_DEFAULT);
            setSkipped(false);
            return;
        }

        const interval = setInterval(() => {
            if (secondsToAction > 0) {
                return setSecondsToAction(secondsToAction - 1);
            }

            setSecondsToAction(ACTION_TIME_DEFAULT);
            skip();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [secondsToAction, turn.currentAction]);

    return (
        <S.Box>
            <S.ActionHead>
                {isSelfTurn ? (
                    turn.currentAction ? (
                        <h2>Esperando a ação dos jogadores...</h2>
                    ) : (
                        <>
                            <h2>É sua vez!</h2>
                            <h3>Faça sua ação:</h3>
                        </>
                    )
                ) : turn.currentAction ? (
                    <h2>{turn.currentAction.message}</h2>
                ) : (
                    <h2>Esperando a ação de {turn?.currentUser?.userName}...</h2>
                )}
            </S.ActionHead>

            {isSelfTurn && !turn.currentAction && (
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

            {turn.currentAction && !isSelfTurn && (
                <>
                    <S.ActionButtons>
                        {!skipped && (
                            <>
                                <button>Desafiar</button>
                                {turn.currentAction?.action.blockableBy.length && (
                                    <button>Bloquear</button>
                                )}
                                <button onClick={skip}>Passar</button>
                            </>
                        )}
                    </S.ActionButtons>
                    <S.ActionTimeBar>
                        <div
                            style={{
                                width: `${secondsToAction >= ACTION_TIME_DEFAULT ? 100 : 0}%`,
                                transition: `all ${ACTION_TIME_DEFAULT}s linear`,
                                background: `${
                                    secondsToAction >= ACTION_TIME_DEFAULT ? '#ffc511' : '#ff2d11'
                                }`
                            }}
                        />
                        <div />
                    </S.ActionTimeBar>
                </>
            )}
        </S.Box>
    );
};
