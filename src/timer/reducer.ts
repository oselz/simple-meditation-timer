import { ActionType } from 'typesafe-actions'
import { Id } from 'react-beautiful-dnd'
import { getType } from 'typesafe-actions'
import * as R from 'ramda'
import { Path } from 'ramda'
import { uid } from '../lib/utils'

import { Item, ItemBell, ItemTimer, Settings, Status } from './items'
import {
    add,
    forward,
    move,
    nextColour,
    pause,
    play,
    remove,
    save,
} from './actions'

// magic!
import * as actions from './actions'

export type Action = ActionType<typeof actions>

enum Colours {
    blue = '#2980b9',
    red = '#c0392b',
    darkgrey = '#7f8c8d',
    teal = '#16a085',
    yellow = '#f39c12',
    darkblue = '#2c3e50',
    green = '#27ae60',
    purple = '#8e44ad',
    grey = '#bdc3c7',
    orange = '#d35400',
}

function* coloursGen() {
    const colours = Object.values(Colours)
    while (true) yield* colours
}

const colours = coloursGen()

export type Entry = {
    id: Id
    item: Item
    status: Status
    settings?: Settings
}

export type State = {
    entries: Entry[]
    isPlaying: boolean
    colour: string
}

export const initialState: State = {
    entries: [
        { id: uid(), item: ItemBell, status: 'stop', settings: { bells: 1 } },
        {
            id: uid(),
            item: ItemTimer,
            status: 'stop',
            settings: { length: 10000 },
        },
        { id: uid(), item: ItemBell, status: 'stop', settings: { bells: 3 } },
    ],
    isPlaying: false,
    colour: colours.next().value,
}

function entryIndex(id: Id, entries: Entry[]) {
    return R.findIndex(R.propEq('id', id), entries)
}

function entryLens(id: Id, entries: Entry[], path: Path = []) {
    const p = R.concat([entryIndex(id, entries)], path)
    return R.lensPath(p)
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case getType(add):
            return {
                ...state,
                entries: R.concat(state.entries, [
                    {
                        id: uid(),
                        item: action.payload,
                        status: 'stop',
                    },
                ]),
            }
        case getType(remove):
            return {
                ...state,
                entries: R.remove(
                    entryIndex(action.payload, state.entries),
                    1,
                    state.entries,
                ),
            }
        case getType(move):
            return {
                ...state,
                entries: R.move(
                    action.payload.source,
                    action.payload.dest,
                    state.entries,
                ),
            }
        case getType(forward):
            return state
        case getType(save):
            return {
                ...state,
                entries: R.set(
                    entryLens(action.payload.id, state.entries, ['settings']),
                    action.payload.settings,
                    state.entries,
                ),
            }
        case getType(nextColour):
            return {
                ...state,
                colour: colours.next().value,
            }
        case getType(play):
        case getType(pause):
            return {
                ...state,
                isPlaying: !state.isPlaying,
            }

        default:
            return state
    }
}

// const onFinish = (id: Id) => {
//     const current = R.findIndex(
//         R.propEq('status', 'play'),
//         state.entries,
//     )
//     let update = R.set(R.lensPath([current, 'status']), 'stop', state.entries)
//     if (current < state.entries.length) {
//         update = R.set(R.lensPath([current + 1, 'status']), 'play', update)
//     }
//     setState({
//         ...state,
//         entries: update,
//     })
//     // stop current and start next (if any)
// }

// const updateSettings = (id: Id, settings: Settings) => {
//     const lens = R.lensPath(
//         [R.findIndex(R.propEq('id', id), state.entries), 'settings'],
//     )
//     setState({ ...state, entries: R.set(lens, settings, state.entries) })
// }
