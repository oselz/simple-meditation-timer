import React, {useEffect} from 'react'
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    Id,
} from 'react-beautiful-dnd'
import NoSleep from "nosleep.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFastBackward,
    faFastForward,
    faPause,
    faPlay,
    faPlus,
    faPalette,
    faClock,
    faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'
import {
    faBell,
    faHourglass,
} from '@fortawesome/free-regular-svg-icons'

import { useContextState } from '../app'
import { Item } from './items'
import {
    add,
    back,
    forward,
    move,
    nextColour,
    pause,
    play,
    toggleHelp,
    toggleTime,
} from './actions'

import styles from './styles.module.scss'

const noSleep = new NoSleep()

export const Timer: React.FC = () => {
    const [state, dispatch] = useContextState()
    const disabled = state.entries.length === 0

    useEffect(
        () => {
            state.isPlaying ? noSleep.enable() : noSleep.disable()
        },
        [state.isPlaying]
    )

    const onDragEnd = (result: DropResult) => {
        if (
            result.destination &&
            result.destination.index !== result.source.index
        ) {
            dispatch(move(result.source.index, result.destination.index))
        }
    }
    const getStatus = (id: Id) => {
        if (state.activeItem === id) {
            return state.isPlaying ? 'playing' : 'paused'
        }
        return 'stopped'
    }

    return (
        <div className={styles.container}>
            <TopControls />
            {disabled ? (
                <div className={styles.action}>
                    <Item type="blank" id="none" />
                </div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="actions">
                        {dropProvided => (
                            <div
                                ref={dropProvided.innerRef}
                                {...dropProvided.droppableProps}
                                className={styles.list}
                            >
                                {state.entries.map((entry, index) => (
                                    <Draggable
                                        draggableId={entry.id}
                                        index={index}
                                        key={entry.id}
                                    >
                                        {dragProvided => (
                                            <div
                                                ref={dragProvided.innerRef}
                                                {...dragProvided.draggableProps}
                                                {...dragProvided.dragHandleProps}
                                                className={styles.action}
                                                key={entry.id}
                                            >
                                                <Item
                                                    type={entry.type}
                                                    id={entry.id}
                                                    settings={entry.settings}
                                                    status={getStatus(entry.id)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {dropProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

            <div className={styles.bottomControls}>
                <button
                    disabled={disabled || !state.activeItem}
                    title="Jump back"
                    onClick={() => dispatch(back())}
                >
                    <FontAwesomeIcon icon={faFastBackward} />
                </button>
                <button
                    className={styles.play}
                    disabled={disabled}
                    onClick={() => dispatch(state.isPlaying ? pause() : play())}
                >
                    {state.isPlaying ? (
                        <FontAwesomeIcon
                            icon={faPause}
                            size={'lg'}
                            title="Pause"
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faPlay}
                            size={'lg'}
                            transform={'right-1'}
                            title="Play"
                        />
                    )}
                </button>
                <button
                    disabled={disabled || !state.activeItem}
                    title="Jump forward"
                    onClick={() => dispatch(forward())}
                >
                    <FontAwesomeIcon icon={faFastForward} />
                </button>
            </div>
        </div>
    )
}

const TopControls = () => {
    const [, dispatch] = useContextState()
    return (
        <div className={styles.topControls}>
            <button
                title="Add new bell(s)"
                onClick={() => dispatch(add('bell'))}
            >
                <div className="fa-layers fa-fw">
                    <FontAwesomeIcon
                        icon={faBell}
                        transform={'left-3 down-3'}
                    />
                    <FontAwesomeIcon
                        icon={faPlus}
                        transform={'shrink-6 right-9 up-6'}
                    />
                </div>
            </button>
            <button
                title="Add new timer"
                onClick={() => dispatch(add('timer'))}
            >
                <div className="fa-layers fa-fw">
                    <FontAwesomeIcon
                        icon={faHourglass}
                        transform={'left-3 down-3'}
                    />
                    <FontAwesomeIcon
                        icon={faPlus}
                        transform={'shrink-6 right-9 up-6'}
                    />
                </div>
            </button>
            <div>
                <button
                    title="Precise or human times"
                    onClick={() => dispatch(toggleTime())}
                >
                    <FontAwesomeIcon icon={faClock} />
                </button>
                <button
                    title="Change colour palette"
                    onClick={() => dispatch(nextColour())}
                >
                    <FontAwesomeIcon icon={faPalette} />
                </button>
                <button title="About" onClick={() => dispatch(toggleHelp())}>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                </button>
            </div>
        </div>
    )
}

export default Timer
