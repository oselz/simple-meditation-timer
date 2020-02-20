import moment from 'moment'
import humanize from 'humanize-duration'

const times = [
    0,
    5 * 1000,
    15 * 1000,
    30 * 1000,
    45 * 1000,
    1 * 60 * 1000,
    1.5 * 60 * 1000,
    2 * 60 * 1000,
    2.5 * 60 * 1000,
    3 * 60 * 1000,
    4 * 60 * 1000,
    5 * 60 * 1000,
    6 * 60 * 1000,
    7 * 60 * 1000,
    8 * 60 * 1000,
    9 * 60 * 1000,
    10 * 60 * 1000,
    11 * 60 * 1000,
    12 * 60 * 1000,
    15 * 60 * 1000,
    20 * 60 * 1000,
    25 * 60 * 1000,
    30 * 60 * 1000,
    35 * 60 * 1000,
    40 * 60 * 1000,
    45 * 60 * 1000,
    50 * 60 * 1000,
    55 * 60 * 1000,
    60 * 60 * 1000,
    75 * 60 * 1000,
    90 * 60 * 1000,
    105 * 60 * 1000,
    120 * 60 * 1000,
]
const reverseTimes = Array.from(times).reverse()

export function formatTime(time: number, humanized = true) {
    if (humanized) {
        return humanize(roundTime(time))
    }
    return moment.utc(time).format('HH:mm:ss')
}

export function nextTime(time: number) {
    let next = times.find(t => t > time)
    if (next === undefined) {
        next = time + 30 * 60 * 1000
        if (next >= 24 * 60 * 60 * 1000) {
            return 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000 + 999
        }
    }
    return next
}

export function prevTime(time: number) {
    const prev = reverseTimes.find(t => t < time)
    if (prev === undefined) {
        return time - 30 * 60 * 1000
    }
    return prev
}

export function roundTime(time: number) {
    const seconds = Math.round(time / 1000)
    if (seconds < 30) {
        return time
    }

    let rounding
    if (seconds < 90) {
        rounding = 15
    } else if (seconds < 15 * 60) {
        rounding = 30
    } else if (seconds < 120 * 60) {
        rounding = 5 * 60
    } else {
        rounding = 60 * 30
    }
    // Round up to nearest whole segment
    const adj = seconds % rounding > 0 ? 1 : 0
    return (Math.trunc(seconds / rounding) + adj) * rounding * 1000
}
