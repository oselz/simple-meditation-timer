import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faStopwatch } from '@fortawesome/pro-light-svg-icons'

import styles from './styles.module.scss'

export type Settings = TimerSettings | BellSettings | null

export type Status = 'play' | 'stop' | 'pause'

export type ItemProps = {
    status: Status
    settings: Settings
    saveSettings: (settings: Settings) => void
}

export type Item = React.FC<ItemProps>

type TimerSettings = {
    length: number
}

export const ItemTimer: Item = ({ status, settings, saveSettings }) => {
    return (
        <div className={styles.item}>
            <FontAwesomeIcon icon={faStopwatch}/>
        </div>
    )
}

type BellSettings = {
    bells: number
}

export const ItemBell: Item = ({ status, settings, saveSettings }) => {
    return (
        <div className={styles.item}>
            <FontAwesomeIcon icon={faBell}/>
        </div>
    )
}

