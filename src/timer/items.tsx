import React, { useEffect, useState } from 'react'
import { Id } from 'react-beautiful-dnd'
import classNames from 'classnames'
import useSound from 'use-sound'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHourglass,
    faBell,
    faPlus,
    faMinus,
    faTrash,
    faHourglassStart,
    faHourglassHalf,
    faMinusCircle
} from '@fortawesome/free-solid-svg-icons'
import {
} from '@fortawesome/free-regular-svg-icons'
import { forward, jump, remove, save } from './actions'
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

export type ItemType = 'timer' | 'bell' | 'blank'

type ItemProps = {
    id: Id
    status?: Status
    settings?: Settings
    type?: ItemType
}

export type Item = React.FC<ItemProps>

export const Item: Item = ({ type, ...props }) => {
    switch (type) {
        case 'timer':
            return <ItemTimer {...props} />
        case 'bell':
            return <ItemBell {...props} />
    }
    return <ItemBlank />
}

export const ItemBlank: React.FC = () => {
    return (
        <div className={styles.blank}>
            <FontAwesomeIcon icon={faMinusCircle} size={'2x'} />
        </div>
    )
}
export const ItemTimer: Item = ({ id, status, settings }) => {
    const [state, dispatch] = useContextState()
    const [elapsed, setElapsed] = useState(0)

    const length =
        settings && 'length' in settings ? settings.length : 1000 * 60 * 5

    const editable =
        !state.isPlaying || (state.isPlaying && state.activeItem !== id)

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
            onClick={() => state.activeItem && dispatch(jump(id))}
            style={{
                backgroundColor:
                    status !== 'stopped' || state.activeItem === null
                        ? state.colour
                        : Colours.grey,
            }}
        >
            {length < 15000 ? (
                <button
                    onClick={e => {
                        e.stopPropagation()
                        dispatch(remove(id))
                    }}
                    title="Remove timer"
                    disabled={!editable}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            ) : (
                <button
                    onClick={e => {
                        e.stopPropagation()
                        saveTime(prevTime(length))
                    }}
                    title="Decrease time"
                    disabled={!editable}
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
                onClick={e => {
                    e.stopPropagation()
                    saveTime(nextTime(length))
                }}
                title="Increase time"
                disabled={!editable}
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
    const editable =
        !state.isPlaying || (state.isPlaying && state.activeItem !== id)
    const [play, { sound, stop }] = useSound('/sounds/bell.mp3', {
        sprite: {
            bellOne: [0, 2600],
            bellTwo: [12600, 3800],
            bellThree: [37200, 3800],
        },
    })

    useInterval(
        () => {
            setCurrent(current + 1)
            if (current < bells - 1) {
                sound && sound.volume(1)
                play({ id: 'bellThree' })
            }
        },
        status === 'playing' ? 2500 : null,
    )

    useEffect(() => {
        if (status === 'playing') {
            stop()
            sound && sound.volume(1)
            play({ id: 'bellThree' })
        }
        if (status === 'paused') {
            sound && sound.fade(1, 0, 500)
        }
        if (status === 'stopped') {
            // sound && sound.fade(1, 0, 3500)
        }
    }, [status, play, stop, sound])

    useEffect(() => {
        if (status === 'stopped') {
            setCurrent(0)
        } else if (current >= bells) {
            dispatch(forward())
        }
    }, [status, bells, current, dispatch, play])

    function increment(
        event: React.MouseEvent<HTMLButtonElement>,
        num: number = 1,
    ) {
        event.stopPropagation()
        dispatch(save(id, { bells: bells + num }))
    }
    function decrement(event: React.MouseEvent<HTMLButtonElement>) {
        increment(event, -1)
    }

    return (
        <div
            className={styles.bell}
            onClick={() => state.activeItem && dispatch(jump(id))}
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
                    disabled={!editable}
                >
                    <FontAwesomeIcon icon={faMinus} />
                </button>
            ) : (
                <button
                    onClick={e => {
                        e.stopPropagation()
                        dispatch(remove(id))
                    }}
                    title="Remove bell"
                    disabled={!editable}
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
                onClick={increment}
                disabled={bells > 6 || !editable}
                title="Increase bells"
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    )
}
