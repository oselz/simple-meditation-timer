import React, { Dispatch } from 'react'
import { Id } from 'react-beautiful-dnd'
import classNames from 'classnames'
// import * as R from 'ramda'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHourglass,
    faBell,
    faPlus,
    faMinus,
    faTrash,
} from '@fortawesome/pro-solid-svg-icons'
import {
    faHourglassStart,
    faHourglassHalf,
} from '@fortawesome/pro-regular-svg-icons'
import { faEmptySet } from '@fortawesome/pro-light-svg-icons'

import { Action } from './reducer'
import { remove, save } from './actions'

import styles from './styles.module.scss'
import { useContextState } from '../app'

export type Status = 'play' | 'stop' | 'pause'

type TimerSettings = {
    length: number
}
type BellSettings = {
    bells: number
}

export type Settings = TimerSettings | BellSettings

type ItemProps = {
    id: Id
    status: Status
    settings?: Settings
}

export type Item = React.FC<ItemProps>

export const ItemBlank: React.FC = () => {
    return (
        <div className={styles.blank}>
            <FontAwesomeIcon icon={faEmptySet} size={'2x'} />
        </div>
    )
}

export const ItemTimer: Item = ({ id, status, settings }) => {
    const [state, dispatch] = useContextState()

    // const playing = status === 'play'

    const ActiveTimer = () => (
        <span className="fa-layers fa-fw">
            <FontAwesomeIcon
                icon={faHourglassStart}
                size={'lg'}
                className={classNames(
                    styles.icon,
                    styles.timerFlip,
                    styles.start,
                )}
            />
            <FontAwesomeIcon
                icon={faHourglassHalf}
                size={'lg'}
                className={classNames(
                    styles.icon,
                    styles.timerFlip,
                    styles.half,
                )}
            />
        </span>
    )

    const StaticTimer = () => (
        <FontAwesomeIcon
            icon={faHourglass}
            size={'lg'}
            className={classNames(styles.icon, styles.timerFlip)}
        />
    )

    return (
        <div className={styles.timer} style={{ backgroundColor: state.colour }}>
            <button onClick={() => dispatch(remove(id))} title="Remove timer">
                <FontAwesomeIcon icon={faTrash} />
            </button>
            <StaticTimer />
            <div className={styles.targetTime}>10 minutes</div>
            <button onClick={() => dispatch(remove(id))}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    )
}

export const ItemBell: Item = ({ id, status, settings }) => {
    const [state, dispatch] = useContextState()
    const bells = settings && 'bells' in settings ? settings.bells : 1

    function add(num: number) {
        dispatch(save(id, { bells: bells + num }))
    }

    return (
        <div className={styles.bell} style={{ backgroundColor: state.colour }}>
            {bells > 1 ? (
                <button onClick={() => add(-1)} title="Decrease bells">
                    <FontAwesomeIcon icon={faMinus} />
                </button>
            ) : (
                <button
                    onClick={() => dispatch(remove(id))}
                    title="Remove bell"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            )}
            <div className={styles.bells}>
                {Array.from(Array(bells)).map((_, i) => (
                    <FontAwesomeIcon
                        icon={faBell}
                        key={i}
                        size={'lg'}
                        className={classNames(styles.icon, styles.bellRing)}
                    />
                ))}
            </div>
            <button
                onClick={() => add(1)}
                disabled={bells > 6}
                title="Increase bells"
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    )
}
