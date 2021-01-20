import { createContext, Dispatch, SetStateAction } from 'react';

interface TabSwipeContextType {
    canSwipe: boolean;
    setCanSwipe: Dispatch<SetStateAction<boolean>>;
}

export const TabSwipeContext = createContext<TabSwipeContextType>({
    canSwipe: true,
    setCanSwipe: () => {}
});
