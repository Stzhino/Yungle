import {createContext, useContext, useState, useEffect} from 'react';
import { getCurrentUser } from '../lib/appwrite';

const RefetchContext = createContext();
export const useRefetchContext = () => useContext(RefetchContext);
const RefetchProvider = ({children}) => {
    const [notifRefetch,setNotifRefetch] = useState(false);
    const [messageRefetch, setMessageRefetch] = useState(false);
    return (<RefetchContext.Provider 
    value={{notifRefetch,setNotifRefetch,messageRefetch,setMessageRefetch}}>
        {children}
    </RefetchContext.Provider>)
}
export default RefetchProvider;