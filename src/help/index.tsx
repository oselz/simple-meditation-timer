import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTimes,
    faSignOut,
    faEllipsisV,
} from '@fortawesome/pro-regular-svg-icons'
import { faPlusSquare } from '@fortawesome/pro-light-svg-icons'
import { useContextState } from '../app'
import { toggleHelp } from '../timer/actions'

import styles from './styles.module.scss'

export const Help: React.FC = () => {
    const [state, dispatch] = useContextState()
    return (
        <div className={styles.paper}>
            <div className={styles.header}>
                <img src="logo192.png" title="Logo" />
                <a href="mailto:contact@simplemeditationtimer.com">Contact</a>
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
                    To save as an offline app:
                    <dl>
                        <dt>
                            <strong>iOS</strong>
                        </dt>
                        <dd>
                            From the share menu [{' '}
                            <FontAwesomeIcon rotation={270} icon={faSignOut} />{' '}
                            ] select{' '}
                            <em>
                                Add to Home Screen&nbsp;&nbsp;
                                <FontAwesomeIcon icon={faPlusSquare} />
                            </em>{' '}
                        </dd>
                        <br />
                        <dt>
                            <strong>Android</strong>
                        </dt>
                        <dd>
                            From the Chrome menu [{' '}
                            <FontAwesomeIcon icon={faEllipsisV} /> ] select{' '}
                            <em>Add to Home screen</em>
                        </dd>
                    </dl>
                </p>
            </div>
            <div className={styles.footer}>
                <small>Copyright 2020 Cardo Limited</small>
            </div>
        </div>
    )
}
