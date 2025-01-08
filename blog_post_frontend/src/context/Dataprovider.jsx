import { createContext, useState } from 'react';

const DataContext = createContext(null);

const Dataprovider = ({ children }) => {
    let [account, setAccount] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        _id: '',
        image:'',
    })
    return (
        <DataContext.Provider value={{
            account,
            setAccount
        }} >
            {children}
        </DataContext.Provider>

    )
}

export default Dataprovider;
export { DataContext };