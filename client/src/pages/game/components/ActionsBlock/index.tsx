import { toast } from 'react-hot-toast';

import { ACTIONS } from '../../../../constants/actions';
import CoinImage from '../../../../assets/img/coin.png';
import { ITurn } from '../../../../types/turns';
import { ICard, IUser } from '../../../../types/users';
import { IAction } from '../../../../types/actions';
import { useEffect, useMemo, useState } from 'react';
import { ICardSlug } from '../../../../constants/cards';
import { S } from './styles';
import { Modal } from '../../../../components/Modal';
import { UserBlock } from '../UserBlock';

const ACTION_TIME_DEFAULT = 15;

interface IModal {
    show: boolean;
    action: IAction | null;
}

interface IActionsBlock {
    turn: ITurn;
    userSelf: IUser;
    users: IUser[];
    onAction: (action: IAction, userSelected?: IUser) => void;
    onBlock: (influenceSlug: ICardSlug) => void;
    onSkip: () => void;
    onChallenge: () => void;
    onDiscard: (user: IUser, card: ICard) => void;
}

export const ActionsBlock = ({
    turn,
    userSelf,
    users,
    onAction,
    onSkip,
    onBlock,
    onChallenge,
    onDiscard
}: IActionsBlock) => {
    const [secondsToAction, setSecondsToAction] = useState(ACTION_TIME_DEFAULT);
    const [skipped, setSkipped] = useState(false);
    const [modal, setModal] = useState<IModal>({ show: false, action: null });
    const isSelfTurn = useMemo(() => {
        return userSelf?.id && turn?.currentUser?.id === userSelf.id;
    }, [turn, userSelf]);
    const isSelfTarget = useMemo(() => {
        return userSelf?.id && turn?.challangeAction?.userTarget.id === userSelf.id;
    }, [turn, userSelf]);
    const isSelfChallanger = useMemo(() => {
        return userSelf?.id && turn?.challangeAction?.userChallenger.id === userSelf.id;
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

    const handleAction = (action: IAction) => {
        if (action.slug === 'coup') {
            if (userSelf.money < 7) {
                return toast('Você não tem moedas suficiente.', {
                    icon: '🪙'
                });
            }

            return setModal({ show: true, action });
        }

        if (action.slug === 'assassinate') {
            if (userSelf.money < 3) {
                return toast('Você não tem moedas suficiente.', {
                    icon: '🪙'
                });
            }

            return setModal({ show: true, action });
        }

        if (action.slug === 'steal') {
            return setModal({ show: true, action });
        }

        onAction(action);
    };

    const discard = (card: ICard) => {
        setSkipped(true);
        onDiscard(userSelf, card);
    };

    useEffect(() => {
        if (!turn.action && !turn.counterAction) {
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

    useEffect(() => {
        setSecondsToAction(ACTION_TIME_DEFAULT);
    }, [turn.currentUser]);

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

                        {!turn.action && !turn.counterAction && !turn.challangeAction && (
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
                        {!turn.counterAction && !turn.action && !turn.challangeAction && (
                            <h2>Esperando a ação de {turn?.currentUser?.userName}...</h2>
                        )}
                    </>
                )}

                {(isSelfTarget || isSelfChallanger) && (
                    <>{turn.challangeAction && <h2>{turn.title}</h2>}</>
                )}
            </S.ActionHead>

            {isSelfTurn && (
                <>
                    {!turn.counterAction && !turn.action && !turn.challangeAction && (
                        <S.ActionList>
                            {ACTIONS.map((action) => (
                                <S.ActionItem
                                    key={action.slug}
                                    onClick={() => handleAction(action)}
                                >
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

                                        {!(
                                            turn.action.slug === 'steal' &&
                                            turn.userSelected?.id !== userSelf.id
                                        ) &&
                                            turn.action.blockableBy?.map((slug) => (
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
                                        transition: `all ${
                                            ACTION_TIME_DEFAULT !== secondsToAction
                                                ? ACTION_TIME_DEFAULT
                                                : 0
                                        }s linear`,
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
                        <>
                            <S.ActionButtons>
                                {!skipped && (
                                    <>
                                        <button onClick={challenge}>Desafiar</button>
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
                                        transition: `all ${
                                            ACTION_TIME_DEFAULT !== secondsToAction
                                                ? ACTION_TIME_DEFAULT
                                                : 0
                                        }s linear`,
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
                </>
            )}

            {turn.challangeAction && !isSelfTarget && !isSelfChallanger && (
                <span>Esperando o jogador descartar uma carta...</span>
            )}

            {isSelfTarget && (
                <>
                    {turn.challangeAction?.isSuccessful ? (
                        <>
                            <p>Qual carta irá descartar?</p>
                            <S.CardBlock>
                                {userSelf.cards?.map((card) => (
                                    <S.Card onClick={() => discard(card)} key={card.id}>
                                        {card.name}
                                    </S.Card>
                                ))}
                            </S.CardBlock>
                        </>
                    ) : (
                        <span>Esperando o jogador descartar uma carta...</span>
                    )}
                </>
            )}

            {isSelfChallanger && (
                <>
                    {turn.challangeAction?.isSuccessful ? (
                        <span>Esperando o jogador descartar uma carta...</span>
                    ) : (
                        <>
                            <p>Qual carta irá descartar?</p>
                            <S.CardBlock>
                                {userSelf.cards?.map((card) => (
                                    <S.Card onClick={() => discard(card)} key={card.id}>
                                        {card.name}
                                    </S.Card>
                                ))}
                            </S.CardBlock>
                        </>
                    )}
                </>
            )}

            {modal.show && (
                <Modal
                    title='Escolha seu alvo para a ação:'
                    onClose={() => setModal({ show: false, action: null })}
                >
                    <>
                        <h2>Escolha seu alvo:</h2>
                        <S.ActionUserList>
                            {users
                                ?.filter((user) => user.id !== userSelf.id)
                                ?.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => {
                                            onAction(modal.action!, user);
                                            setModal({ show: false, action: null });
                                        }}
                                    >
                                        <UserBlock
                                            name={user.userName}
                                            money={user.money!}
                                            cards={user.cards!}
                                            showCards={false}
                                        />
                                    </div>
                                ))}
                        </S.ActionUserList>
                    </>
                </Modal>
            )}
        </S.Box>
    );
};
