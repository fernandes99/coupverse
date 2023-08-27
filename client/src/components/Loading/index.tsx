import { S } from './styles';

export const LoadingBlock = () => {
    return (
        <S.Overlay>
            <S.Box>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </S.Box>
        </S.Overlay>
    );
};
