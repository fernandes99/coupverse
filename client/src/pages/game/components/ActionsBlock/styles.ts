import { styled } from 'styled-components';

export const S = {
    Box: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 24px;
        width: fit-content;
        background-color: #fff;
        border-radius: 8px;

        h2 {
            font-size: 18px;
            font-weight: 600;
            color: #354c36;
        }

        h3 {
            font-size: 18px;
            color: #232423;
            margin-bottom: 8px;
        }
    `,
    ActionHead: styled.div`
        margin-bottom: 8px;
        h2 {
            margin-bottom: 8px;
        }
    `,
    ActionList: styled.ul`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 8px;
    `,
    ActionItem: styled.li`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        min-width: 250px;
        min-height: 38px;
        border: 1px solid #e4e4e4;
        border-radius: 8px;
        transition: all 0.3s;
        cursor: pointer;

        p {
            font-weight: 500;
            color: #232423;
        }

        &:hover {
            transform: translateY(-2px);
        }
    `,
    ActionMoney: styled.div<{ isNegative: boolean }>`
        display: flex;
        align-items: center;
        gap: 4px;

        span {
            font-weight: 600;
            color: ${(props) => (props.isNegative ? '#E72E2E' : '#E7A52E')};
        }
    `,
    ActionButtons: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;

        button {
            background-color: #fed262;
            padding: 10px 24px;
            border-radius: 6px;
            border: unset;
            color: #4d401f;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s;
            cursor: pointer;

            &:hover {
                background-color: #f1c552;
            }
        }
    `,
    ActionTimeBar: styled.div`
        position: relative;
        background-color: #e9e9e9;
        width: 100%;
        height: 4px;
        border-radius: 2px;
        overflow: hidden;
        margin-top: 8px;

        & > div {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            border-radius: 2px;
        }
    `
};
