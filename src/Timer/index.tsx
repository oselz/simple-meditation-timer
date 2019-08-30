import React, { useState } from 'react'
import * as R from 'ramda'
import { DragDropContext, Draggable, Droppable, DropResult, Id } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripLinesVertical } from '@fortawesome/pro-light-svg-icons'
import { faFastBackward, faFastForward, faPlay } from '@fortawesome/pro-solid-svg-icons'

import { ItemBell, ItemTimer, Status, Item, Settings } from './items'
import styles from './styles.module.scss'

type Entry = {
    id: Id,
    item: Item
    status: Status
    settings: Settings
}

const initial: Entry[] = [
    { id: uid(), item: ItemBell, status: 'stop', settings: { bells: 1 } },
    { id: uid(), item: ItemTimer, status: 'stop', settings: { length: 10000 } },
    { id: uid(), item: ItemBell, status: 'stop', settings: { bells: 3 } },
]

function uid() {
    return Math.random().toString(35).substr(2, 7)
}

export const Timer: React.FC = () => {
    const [state, setState] = useState({
        entries: initial,
        playing: false,
    })

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return
        }
        if (result.destination.index === result.source.index) {
            return
        }
        setState({
            ...state,
            entries: R.move(
                result.source.index,
                result.destination.index,
                state.entries,
            ),
        })
    }
    const onFinish = (id: Id) => {
        const current = R.findIndex(
            R.propEq('status', 'play'),
            state.entries,
        )
        let update = R.set(R.lensPath([current, 'status']), 'stop', state.entries)
        if (current < state.entries.length) {
            update = R.set(R.lensPath([current + 1, 'status']), 'play', update)
        }
        setState({
            ...state,
            entries: update,
        })
        // stop current and start next (if any)
    }

    const updateSettings = (id: Id, settings: Settings) => {
        const lens = R.lensPath(
            [R.findIndex(R.propEq('id', id), state.entries), 'settings'],
        )
        setState({ ...state, entries: R.set(lens, settings, state.entries) })
    }

    const addEntry = (item: Item) => {
        setState({
            ...state,
            entries: state.entries.concat({
                id: uid(),
                item: item,
                status: 'stop',
                settings: null,
            }),
        })
    }

    const renderEntries = () =>
        state.entries.map((entry, index) =>
            <Draggable draggableId={entry.id} index={index}>
                {dragProvided => (
                    <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        className={styles.draggableAction}
                    >
                        <FontAwesomeIcon
                            icon={faGripLinesVertical}
                            className={styles.handle}
                        />
                        {entry.item({
                            settings: entry.settings,
                            status: entry.status,
                            saveSettings: (settings) =>
                                updateSettings(entry.id, settings),
                        })}
                    </div>
                )}
            </Draggable>,
        )

    return (
        <div className={styles.container}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="actions">
                    {dropProvided => (
                        <div
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}
                        >
                            {renderEntries()}
                            {dropProvided.placeholder}
                            <button onClick={() => addEntry(ItemBell)}>Add bell</button>
                            <button onClick={() => addEntry(ItemTimer)}>Add timer</button>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div className={styles.controls}>
                <FontAwesomeIcon icon={faFastForward}/>
                <FontAwesomeIcon icon={faPlay}/>
                <FontAwesomeIcon icon={faFastBackward}/>
            </div>
        </div>
    )
}

export default Timer
