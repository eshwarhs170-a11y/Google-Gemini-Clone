import { createContext } from "react";
import main from "../config/gemini"

export const Context=createContext();

const ContextProvider=(props)=>{
       
    const onSent=async (prompt)=>{
        await runChat(prompt)
    }
    onSent("what is this ")

    const contextvalue={

    }
    return(
        <Context.Provider value={contextvalue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider;