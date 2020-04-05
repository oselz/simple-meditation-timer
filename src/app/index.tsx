import React, {
    createContext,
    useContext,
    useReducer,
    Dispatch,
    useEffect,
} from 'react'
import { Action, initialState, reducer, State } from '../timer/reducer'
import Timer from '../timer'

import styles from './styles.module.scss'
import { Help } from '../help'

const StateContext = createContext({} as [State, Dispatch<Action>])
export const useContextState = () => useContext(StateContext)

const localSettings = localStorage.getItem('settings')
const localState = localSettings ? JSON.parse(localSettings) : initialState

export const App: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, localState)

    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(state))
    }, [state])

    return (
        <div className={styles.app}>
            <StateContext.Provider value={[state, dispatch]}>
                {state.showHelp ? <Help /> : <Timer />}
            </StateContext.Provider>
        </div>
    )
}

export default App
