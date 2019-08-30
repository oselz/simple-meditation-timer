import React from 'react'
import styles from './styles.module.scss'

import Timer from '../Timer'

export const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <Timer/>
        </div>
    )
}

export default App
