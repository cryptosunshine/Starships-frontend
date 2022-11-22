import React, { useReducer, useContext, createContext } from "react";
import reducer, { store } from "./reducer";

const GlobalContext: React.Context<{}> = createContext<any | undefined>(undefined);

export const GlobalProvider:any = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, store);

    const context = {
        state, dispatch
    }
    
    return <GlobalContext.Provider value={ context }> { children } </GlobalContext.Provider>
}

export const useGlobal = () => {
    const context:any = useContext(GlobalContext);
    return context;
}
