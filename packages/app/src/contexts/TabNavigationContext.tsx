import React, { useState, createContext } from 'react';

export const TabNavigationContext = createContext({
    mainIndex: 1,
    liveTabsIndex: 1,
    setMainIndex: (i: number) => undefined,
    setLiveTabsIndex: (i: number) => undefined
});

export const TabNavigationContextProvider: React.FC = ({ children }) => {
    const [mainIndex, setMainIndex] = useState(1);
    const [liveTabsIndex, setLiveTabsIndex] = useState(1);

    return (
        <TabNavigationContext.Provider
            value={{
                mainIndex,
                liveTabsIndex,
                setMainIndex,
                setLiveTabsIndex
            }}
        >
            {children}
        </TabNavigationContext.Provider>
    );
};
