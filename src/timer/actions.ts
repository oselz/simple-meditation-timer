import { Id } from 'react-beautiful-dnd'
import { createAction } from 'typesafe-actions'

import { ItemType, Settings } from './items'

export const add = createAction('timer/ADD')<ItemType>()
export const remove = createAction('timer/REMOVE')<Id>()
export const play = createAction('timer/PLAY')()
export const stop = createAction('timer/STOP')()
export const pause = createAction('timer/PAUSE')()
export const forward = createAction('timer/FORWARD')()
export const back = createAction('timer/BACK')()
export const jump = createAction('time/JUMP')<Id>()

export const save = createAction(
    'timer/SAVE',
    (id: Id, settings: Settings) => ({ id, settings }),
)()
export const move = createAction(
    'timer/MOVE',
    (source: number, dest: number) => ({ source, dest }),
)()
export const nextColour = createAction('timer/NEXT_COLOUR')()
export const toggleTime = createAction('timer/TOGGLE_TIME')()
export const toggleHelp = createAction('timer/TOGGLE_HELP')()
