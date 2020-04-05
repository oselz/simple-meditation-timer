import { createAction } from 'typesafe-actions'
import { Id } from 'react-beautiful-dnd'

import { ItemType, Settings } from './items'

export const add = createAction('timer/ADD', action => {
    return (type: ItemType) => action(type)
})
export const remove = createAction('timer/REMOVE', action => {
    return (id: Id) => action(id)
})
export const play = createAction('timer/PLAY')
export const stop = createAction('timer/STOP')
export const pause = createAction('timer/PAUSE')
export const forward = createAction('timer/FORWARD')
export const back = createAction('timer/BACK')
export const save = createAction('timer/SAVE', action => {
    return (id: Id, settings: Settings) => action({ id, settings })
})
export const move = createAction('timer/MOVE', action => {
    return (source: number, dest: number) => action({ source, dest })
})
export const nextColour = createAction('timer/NEXT_COLOUR')
export const toggleTime = createAction('timer/TOGGLE_TIME')
export const toggleHelp = createAction('timer/TOGGLE_HELP')
