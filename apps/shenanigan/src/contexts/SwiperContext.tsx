import React, { useState, createContext } from 'react';

export const SwiperContext = createContext({
    swiperIndex: 1,
    setSwiperIndex: (i: number) => {},
    walletScroll: true,
    setWalletScroll: (i: boolean) => {}
});

export const SwiperContextProvider: React.FC = ({ children }) => {
    const [swiperIndex, setSwiperIndex] = useState(1);
    const [walletScroll, setWalletScroll] = useState(true);

    return (
        <SwiperContext.Provider
            value={{
                swiperIndex,
                setSwiperIndex,
                walletScroll,
                setWalletScroll
            }}
        >
            {children}
        </SwiperContext.Provider>
    );
};
