import React, { useEffect, useState } from 'react'
import { Id } from 'react-beautiful-dnd'
import classNames from 'classnames'
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
import { forward, remove, save } from './actions'
import { formatTime, nextTime, prevTime } from './time'
import { useContextState } from '../app'

import styles from './styles.module.scss'
import { Colours } from './reducer'
import { useInterval } from '../lib/utils'

export type Status = 'playing' | 'paused' | 'stopped'

type TimerSettings = {
    // ms
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
    const [elapsed, setElapsed] = useState(0)

    const length =
        settings && 'length' in settings ? settings.length : 1000 * 60 * 5

    useInterval(
        () => {
            setElapsed(elapsed + 1000)
        },
        status === 'playing' ? 1000 : null,
    )

    useEffect(() => {
        if (status === 'stopped') {
            setElapsed(0)
        } else if (elapsed >= length) {
            dispatch(forward())
        }
    }, [elapsed, length, status, dispatch])

    function saveTime(time: number) {
        dispatch(save(id, { length: time }))
        setElapsed(0)
    }

    return (
        <div
            className={styles.timer}
            style={{
                backgroundColor:
                    status !== 'stopped' || state.activeItem === null
                        ? state.colour
                        : Colours.grey,
            }}
        >
            {length < 15000 ? (
                <button
                    onClick={() => dispatch(remove(id))}
                    title="Remove timer"
                    disabled={state.isPlaying}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            ) : (
                <button
                    onClick={() => saveTime(prevTime(length))}
                    title="Decrease time"
                    disabled={state.isPlaying}
                >
                    <FontAwesomeIcon icon={faMinus} />
                </button>
            )}
            {status === 'playing' ? (
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
            ) : (
                <FontAwesomeIcon
                    icon={faHourglass}
                    size={'lg'}
                    className={classNames(styles.icon, styles.timerFlip)}
                />
            )}
            <div className={styles.inputTime}>
                {formatTime(length - elapsed, state.humanTime)}
            </div>
            <button
                onClick={() => saveTime(nextTime(length))}
                title="Increase time"
                disabled={state.isPlaying}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    )
}

export const ItemBell: Item = ({ id, status, settings }) => {
    const [state, dispatch] = useContextState()
    const [current, setCurrent] = useState(0)

    const bells = settings && 'bells' in settings ? settings.bells : 1

    useInterval(
        () => {
            setCurrent(current + 1)
        },
        status === 'playing' ? 1000 : null,
    )

    useEffect(() => {
        if (status === 'stopped') {
            setCurrent(0)
        } else if (current >= bells) {
            dispatch(forward())
        }
    }, [status, bells, current, dispatch])

    function increment(num: number = 1) {
        dispatch(save(id, { bells: bells + num }))
    }
    function decrement() {
        increment(-1)
    }

    return (
        <div
            className={styles.bell}
            style={{
                backgroundColor:
                    status !== 'stopped' || state.activeItem === null
                        ? state.colour
                        : Colours.grey,
            }}
        >
            {bells > 1 ? (
                <button
                    onClick={decrement}
                    title="Decrease bells"
                    disabled={state.isPlaying}
                >
                    <FontAwesomeIcon icon={faMinus} />
                </button>
            ) : (
                <button
                    onClick={() => dispatch(remove(id))}
                    title="Remove bell"
                    disabled={state.isPlaying}
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
                        className={
                            status === 'playing' && current === i
                                ? classNames(styles.icon, styles.bellRing)
                                : classNames(styles.icon)
                        }
                    />
                ))}
            </div>
            <button
                onClick={() => increment()}
                disabled={bells > 6 || state.isPlaying}
                title="Increase bells"
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    )
}
