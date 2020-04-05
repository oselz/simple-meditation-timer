import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-regular-svg-icons'
import { useContextState } from '../app'
import { toggleHelp } from '../timer/actions'

import styles from './styles.module.scss'

export const Help: React.FC = () => {
    const [state, dispatch] = useContextState()
    return (
        <div className={styles.paper}>
            <div className={styles.header}>
                <img src="logo192.png" title="Logo" />
                <button title="Close" onClick={() => dispatch(toggleHelp())}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <div className={styles.content}>
                <h1>Simple Meditation Timer</h1>
                <p>
                    The no-frills meditation timer; because just sitting is
                    good.
                </p>
                <p>
                    <a href="mailto:contact@simplemeditationtimer.com">
                        Contact
                    </a>
                </p>
            </div>
            <div className={styles.footer}>
                <small>Copyright 2020 Cardo Limited</small>
            </div>
        </div>
    )
}
