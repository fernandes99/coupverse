import styled from 'styled-components';

export const S = {
    Content: styled.div`
        background-color: #ffffff;
        padding: 52px;
        border-radius: 16px;
        min-width: 380px;
    `,
    Button: styled.button<{ isReady: boolean }>`
        background-color: ${(props) => (props.isReady ? '#fef0c8' : '#fed262')};
        height: 48px;
        width: 100%;
        color: #4d401f;
        border-radius: 6px;
        border: unset;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 8px;

        &:hover {
            background-color: #f1c552;
        }
    `,
    UserList: styled.ul`
        display: flex;
        flex-direction: column;
        gap: 24px;
        border: 1px solid;
        padding: 16px;
        border: 1px solid #e8e8e8;
        border-radius: 6px;
        min-width: 380px;

        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    `,
    Tag: styled.div<{ ready: boolean }>`
        border: 1px solid ${(props) => (props.ready ? '#2EA033' : '#E00D00')};
        border-radius: 4px;
        color: ${(props) => (props.ready ? '#2EA033' : '#E00D00')};
        padding: 4px 8px;
        font-size: 14px;
    `,
    SmallText: styled.p`
        text-align: center;
        color: #707070;
        font-size: 14px;
        margin-top: 16px;
    `,
    Head: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 24px 0 12px;

        span {
            font-size: 12px;
            font-weight: bolder;
            letter-spacing: 1px;
            color: #8d8d8d;
            margin-right: 4px;
        }
    `,
    CopyBlock: styled.div`
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
        border: 1px solid #e8e8e8;
        border-style: dashed;
        border-radius: 6px;
        transition: all 0.3s;
        cursor: pointer;

        svg {
            transition: all 0.3s;
            color: #858585;
        }

        &:hover {
            background-color: #f7f7f7;

            svg {
                color: #4c4c4c;
            }
        }
    `,
    CodeRoom: styled.p`
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 2px;
        line-height: 110%;
    `,
    Flex: styled.div`
        display: flex;
        align-items: center;
        gap: 4px;
    `
};
