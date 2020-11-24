import AsyncStorage from '@react-native-community/async-storage';
import { useState } from 'react';

export function useLocalStorage(
    key: string,
    initialValue: unknown
): [Promise<any>, (value: unknown) => Promise<void>] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(async () => {
        try {
            // Get from local storage by key
            const item = await AsyncStorage.getItem(key);
            // Parse stored json or if none return initialValue
            // console.log("ITEM IN STORAGE ",item)
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            // console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = async (value: unknown) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storedValue, setValue];
}
