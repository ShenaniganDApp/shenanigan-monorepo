import React, { useState, createContext } from 'react';

export const TabNavigationContext = createContext({
    mainIndex: 1,
    setMainIndex: (i: number) => {},
    liveTabsIndex: 1,
    setLiveTabsIndex: (i: number) => {},
    lineupId: '',
    setLineupId: (id: string) => {}
});

export const TabNavigationContextProvider: React.FC = ({ children }) => {
    const [mainIndex, setMainIndex] = useState(1);
    const [liveTabsIndex, setLiveTabsIndex] = useState(1);
    const [lineupId, setLineupId] = useState<string>('');

    return (
        <TabNavigationContext.Provider
            value={{
                mainIndex,
                liveTabsIndex,
                setMainIndex,
                setLiveTabsIndex,
                lineupId,
                setLineupId
            }}
        >
            {children}
        </TabNavigationContext.Provider>
    );
};
