import React, { createContext, useContext, useReducer, Dispatch } from 'react'

import { Action, initialState, reducer, State } from '../timer/reducer'
import Timer from '../timer'

import styles from './styles.module.scss'

const StateContext = createContext({} as [State, Dispatch<Action>])
export const useContextState = () => useContext(StateContext)

export const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <StateContext.Provider value={useReducer(reducer, initialState)}>
                <Timer />
            </StateContext.Provider>
        </div>
    )
}

export default App
