import { useEffect, useRef } from 'react'

export function uid() {
    return Math.random()
        .toString(35)
        .substr(2, 7)
}

export const useInterval = (
    callback: () => void,
    delay: number | null,
): void => {
    const savedCallback: any = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        const handler = (...args: any) => savedCallback.current(...args)

        if (delay !== null) {
            const id = setInterval(handler, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}
