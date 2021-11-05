import React, { useState, createContext } from 'react';

export const TabNavSwipeContext = createContext({
    mainTabsSwipe: true,
    setMainTabsSwipe: (b: boolean) => {},
    liveTabsSwipe: true,
    setLiveTabsSwipe: (b: boolean) => {}
});

export const TabNavSwipeContextProvider: React.FC = ({ children }) => {
    const [mainTabsSwipe, setMainTabsSwipe] = useState(true);
    const [liveTabsSwipe, setLiveTabsSwipe] = useState(true);

    return (
        <TabNavSwipeContext.Provider
            value={{
                mainTabsSwipe,
                setMainTabsSwipe,
                liveTabsSwipe,
                setLiveTabsSwipe
            }}
        >
            {children}
        </TabNavSwipeContext.Provider>
    );
};
