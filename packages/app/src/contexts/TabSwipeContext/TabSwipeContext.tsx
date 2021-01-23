import React, { useState, createContext } from 'react';

interface TabSwipeContextType {
    canSwipe: boolean;
    setCanSwipe: (canSwipe: boolean) => void;
}

export const TabSwipeContext = createContext<TabSwipeContextType>({
    canSwipe: true,
    setCanSwipe: () => {}
});

export const TabSwipeContextProvider: React.FC = ({ children }) => {
    const [canSwipe, setCanSwipe] = useState(true);

    return (
        <TabSwipeContext.Provider value={{ canSwipe, setCanSwipe }}>
            {children}
        </TabSwipeContext.Provider>
    );
};
