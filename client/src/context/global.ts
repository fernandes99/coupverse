import { createContext, useContext } from 'react';

const INITIAL_GLOBAL_CONTEXT = {
    loading: true,
    setLoading: () => null
};

export interface IGlobalContext {
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export const GlobalContext = createContext<IGlobalContext>(INITIAL_GLOBAL_CONTEXT);
export const useGlobalContext = () => useContext(GlobalContext);
