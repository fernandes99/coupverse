import { ACTIONS } from '../../../../constants/actions';
import { S } from './styles';
import CoinImage from '../../../../assets/img/coin.png';
import { ITurn } from '../../../../types/turns';
import { IUser } from '../../../../types/users';
import { IAction } from '../../../../types/actions';
import { useEffect, useMemo, useState } from 'react';
import { ICardSlug } from '../../../../constants/cards';

const ACTION_TIME_DEFAULT = 10;

interface IActionsBlock {
    turn: ITurn;
    userSelf: IUser;
    onAction: (actions: IAction) => void;
    onBlock: (influenceSlug: ICardSlug) => void;
    onSkip: () => void;
    onChallenge: () => void;
}

export const ActionsBlock = ({
    turn,
    userSelf,
    onAction,
    onSkip,
    onBlock,
    onChallenge
}: IActionsBlock) => {
    const [secondsToAction, setSecondsToAction] = useState(ACTION_TIME_DEFAULT);
    const [skipped, setSkipped] = useState(false);
    const isSelfTurn = useMemo(() => {
        return turn?.currentUser?.id === userSelf?.id;
    }, [turn, userSelf]);

    const skip = () => {
        setSkipped(true);
        onSkip();
    };

    const block = (influenceSlug: ICardSlug) => {
        setSkipped(true);
        onBlock(influenceSlug);
    };

    const challenge = () => {
        setSkipped(true);
        onChallenge();
    };

    useEffect(() => {
        if (!turn.action) {
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
    }, [secondsToAction, turn.currentUser]);

    return (
        <S.Box>
            <S.ActionHead>
                {isSelfTurn && (
                    <>
                        {turn.action && <h2>Esperando a ação dos jogadores...</h2>}
                        {turn.counterAction && (
                            <>
                                <h2>Você bloqueou {turn.counterAction.slug}!</h2>
                                <h3>Esperando a ação dos jogadores...</h3>
                            </>
                        )}

                        {!turn.action && !turn.counterAction && (
                            <>
                                <h2>É sua vez!</h2>
                                <h3>Faça sua ação:</h3>
                            </>
                        )}
                    </>
                )}

                {!isSelfTurn && (
                    <>
                        {turn.action && <h2>{turn.title}</h2>}
                        {turn.counterAction && (
                            <>
                                <h2>
                                    {turn.currentUser?.userName} bloqueou {turn.counterAction.slug}!
                                </h2>
                                <h3>O que você faz?</h3>
                            </>
                        )}
                        {!turn.counterAction && !turn.action && (
                            <h2>Esperando a ação de {turn?.currentUser?.userName}...</h2>
                        )}
                    </>
                )}
            </S.ActionHead>

            {isSelfTurn && (
                <>
                    {!turn.counterAction && !turn.action && (
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
                </>
            )}

            {!isSelfTurn && (
                <>
                    {turn.action && (
                        <>
                            <S.ActionButtons>
                                {!skipped && (
                                    <>
                                        {turn.action.isChallengeable && (
                                            <button onClick={challenge}>Desafiar</button>
                                        )}

                                        {turn.action.blockableBy?.map((slug) => (
                                            <button key={slug} onClick={() => block(slug)}>
                                                Bloquear ({slug})
                                            </button>
                                        ))}

                                        <button onClick={skip}>Passar</button>
                                    </>
                                )}
                            </S.ActionButtons>
                            <S.ActionTimeBar>
                                <div
                                    style={{
                                        width: `${
                                            secondsToAction >= ACTION_TIME_DEFAULT ? 100 : 0
                                        }%`,
                                        transition: `all ${ACTION_TIME_DEFAULT}s linear`,
                                        background: `${
                                            secondsToAction >= ACTION_TIME_DEFAULT
                                                ? '#ffc511'
                                                : '#ff2d11'
                                        }`
                                    }}
                                />
                                <div />
                            </S.ActionTimeBar>
                        </>
                    )}

                    {turn.counterAction && (
                        <div>
                            <S.ActionButtons>
                                {!skipped && (
                                    <>
                                        <button>Desafiar</button>
                                        <button onClick={skip}>Passar</button>
                                    </>
                                )}
                            </S.ActionButtons>
                            <S.ActionTimeBar>
                                <div
                                    style={{
                                        width: `${
                                            secondsToAction >= ACTION_TIME_DEFAULT ? 100 : 0
                                        }%`,
                                        transition: `all ${ACTION_TIME_DEFAULT}s linear`,
                                        background: `${
                                            secondsToAction >= ACTION_TIME_DEFAULT
                                                ? '#ffc511'
                                                : '#ff2d11'
                                        }`
                                    }}
                                />
                                <div />
                            </S.ActionTimeBar>
                        </div>
                    )}
                </>
            )}
        </S.Box>
    );
};
