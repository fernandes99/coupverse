import { styled } from 'styled-components';

export const S = {
    Content: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,
    Title: styled.h1`
        color: #fff;
        font-size: 32px;
    `,
    UserList: styled.div`
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16px;
    `
};
