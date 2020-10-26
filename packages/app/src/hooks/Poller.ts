import { useEffect, useRef } from 'react';

export default function usePoller(
    fn: () => unknown,
    delay: number,
    extraWatch?: boolean
) {
    const savedCallback = useRef<HTMLInputElement | null>(null);
    // Remember the latest fn.
    useEffect(() => {
        savedCallback.current = fn;
    }, [fn]);
    // Set up the interval.
    // eslint-disable-next-line consistent-return
    useEffect(() => {
        console.log('tick');
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
    // run at start too
    useEffect(() => {
        fn();
    }, [extraWatch]);
}
