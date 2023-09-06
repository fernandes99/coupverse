import { styled } from 'styled-components';

export const S = {
    Container: styled.div`
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        z-index: 10;
        pointer-events: none;
    `,
    Content: styled.div`
        background: #ffffff;
        border-radius: 4px;
        width: 800px;
        pointer-events: all;
    `,
    Head: styled.div`
        justify-content: space-between;
        align-items: center;
        padding: 16px;
    `,
    Body: styled.div`
        padding: 16px;
    `,
    Overlay: styled.div`
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: #000000a1;
        z-index: 1;
    `
};
