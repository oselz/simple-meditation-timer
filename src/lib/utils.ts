export function uid() {
    return Math.random()
        .toString(35)
        .substr(2, 7)
}
