import { S } from './styles';

interface IModal {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    width?: string;
}

export const Modal = ({ title, children, onClose, width = '800px' }: IModal) => {
    return (
        <>
            <S.Overlay onClick={onClose} />

            <S.Container>
                <S.Content style={{ width: width }}>
                    <S.Head>
                        <p>{title}</p>
                    </S.Head>
                    <S.Body>{children}</S.Body>
                </S.Content>
            </S.Container>
        </>
    );
};
