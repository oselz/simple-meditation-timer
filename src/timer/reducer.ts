import { ActionType } from 'typesafe-actions'
import { Id } from 'react-beautiful-dnd'
import { getType } from 'typesafe-actions'
import * as R from 'ramda'
import { Path } from 'ramda'
import { uid } from '../lib/utils'

import { ItemType, Settings } from './items'
import {
    add,
    back,
    forward,
    jump,
    move,
    nextColour,
    pause,
    play,
    remove,
    save,
    toggleHelp,
    toggleTime,
} from './actions'

// magic!
import * as actions from './actions'

export type Action = ActionType<typeof actions>

export enum Colours {
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
    const colours: string[] = Object.values(Colours)
    while (true) yield* colours
}

const colours = coloursGen()

export type Entry = {
    id: Id
    type: ItemType
    settings?: Settings
}

export type State = {
    entries: Entry[]
    isPlaying: boolean
    colour: string
    humanTime: boolean
    activeItem: Id | null
    showHelp: boolean
}

export const initialState: State = {
    entries: [
        { id: uid(), type: 'bell', settings: { bells: 1 } },
        {
            id: uid(),
            type: 'timer',
            settings: { length: 5 * 60 * 1000 },
        },
        { id: uid(), type: 'bell', settings: { bells: 3 } },
    ],
    isPlaying: false,
    colour: colours.next().value || Colours.grey.valueOf(),
    activeItem: null,
    humanTime: true,
    showHelp: false,
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
                        type: action.payload,
                    },
                ]),
            }
        case getType(remove):
            const active = state.activeItem === action.payload
            return {
                ...state,
                entries: R.remove(
                    entryIndex(action.payload, state.entries),
                    1,
                    state.entries,
                ),
                activeItem: active ? null : state.activeItem,
                isPlaying: active ? false : state.isPlaying,
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
        case getType(forward): {
            // search for active as list can be re-ordered whilst playing
            const index = R.findIndex(R.propEq('id', state.activeItem))(
                state.entries,
            )
            if (index !== -1 && index < state.entries.length - 1) {
                return {
                    ...state,
                    activeItem: state.entries[index + 1].id,
                }
            }
            return {
                ...state,
                activeItem: null,
                isPlaying: false,
            }
        }
        case getType(back): {
            // search for active as list can be re-ordered whilst playing
            const index = R.findIndex(R.propEq('id', state.activeItem))(
                state.entries,
            )
            if (index > 0) {
                return {
                    ...state,
                    activeItem: state.entries[index - 1].id,
                }
            }
            return {
                ...state,
                activeItem: null,
                isPlaying: false,
            }
        }
        case getType(jump):
            return {
                ...state,
                activeItem: action.payload,
            }
        case getType(save):
            return {
                ...state,
                entries: R.set(
                    entryLens(action.payload.id, state.entries, ['settings']),
                    action.payload.settings,
                    state.entries,
                ),
            }
        case getType(nextColour): {
            let colour = colours.next().value || Colours.grey.valueOf()
            if (colour === state.colour) {
                colour = colours.next().value || Colours.grey.valueOf()
            }
            return {
                ...state,
                colour,
            }
        }
        case getType(toggleTime):
            return {
                ...state,
                humanTime: !state.humanTime,
            }
        case getType(play):
            return {
                ...state,
                isPlaying: true,
                activeItem: state.activeItem
                    ? state.activeItem
                    : state.entries[0].id,
            }
        case getType(pause):
            return {
                ...state,
                isPlaying: false,
            }

        case getType(toggleHelp):
            return {
                ...state,
                showHelp: !state.showHelp,
            }

        default:
            return state
    }
}
