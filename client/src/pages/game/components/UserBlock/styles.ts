import { styled } from 'styled-components';

export const S = {
    Box: styled.div`
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        min-width: 240px;
        background-color: #fff;
        border-radius: 8px;
    `,
    Title: styled.p`
        font-size: 20px;
        color: #232423;
    `,
    Status: styled.div`
        display: flex;
        justify-content: space-between;

        svg {
            color: #e43333;
        }
    `,
    LifeBlock: styled.div`
        display: flex;
        gap: 6px;
    `,
    MoneyBlock: styled.div`
        display: flex;
        align-items: center;
        gap: 4px;

        span {
            font-size: 18px;
            font-weight: 600;
            color: #e28424;
        }
    `,
    CardBlock: styled.div`
        display: flex;
        flex-direction: column;
        gap: 4px;

        p {
            color: #232423;
            margin-bottom: 4px;
        }
    `,
    Card: styled.div`
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e4e4e4;
        border-radius: 8px;
        font-size: 16px;
    `
};
