import puzzles from '../puzzles/diff.json'
import {storeProgress} from '../progress.js'

let cells = []
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        cells.push({
            id: i * 9 + j,
            value: 0,
            notes:
                [false, false, false,
                    false, false, false,
                    false, false, false],
            solution: 0,
            focused: false,
            mutable: true,
            highlight: 0,
            solved: false,
        })
    }
}

const initialState = {
    cells: cells,
    notes: false,
    number: 0,
    focused: {
        id: -1,
        column: -1,
        seat: -1,
        value: 0,
    },
    mistakes: 0,
    unsolved: 0,
    undeletable: false,
    difficulty: 0,
    difficultyMap: ['very easy', 'easy', 'medium', 'hard', 'extrem'],
    time: 0,
    continueTime: false,
    abort: false
}

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'cell/cellValueChanged': {
            return {
                ...state,
                cells: state.cells.map(cell => {
                    if (cell.id !== action.payload.id) {
                        return cell
                    }
                    return {
                        ...cell,
                        value: action.payload.value
                    }
                })
            }
        }
        case 'cell/cellNotesChanged': {
            return {
                ...state,
                cells: state.cells.map(cell => {
                    if (cell.id !== action.payload.id) {
                        return cell
                    }
                    return {
                        ...cell,
                        notes: action.payload.notes
                    }
                })
            }
        }
        case 'cell/cellSolutionChanged': {
            return {
                ...state,
                cells: state.cells.map(cell => {
                    if (cell.id !== action.payload.id) {
                        return cell
                    }
                    return {
                        ...cell,
                        solution: action.payload.solution
                    }
                })
            }
        }
        case 'cell/loadCell': {
            let values = []
            let solutions = []
            let cellCopy = [...state.cells]
            let unsolved = 0
            // let puzzles = fetch('../puzzles/diff.json')
            let sortedPuzzles = puzzles.filter(puzzle => puzzle.difficulty > state.difficulty && puzzle.difficulty < (state.difficulty + 1) * (8.5 / 6))
            let puzzle = sortedPuzzles[Math.floor(Math.random() * (sortedPuzzles.length - 1))]

            for (let c of puzzle.puzzle) {
                values.push(parseInt(c))
                if (parseInt(c) === 0) {
                    unsolved++
                }
            }
            for (let c of puzzle.solution) {
                solutions.push(parseInt(c))
            }
            for (let i in cellCopy) {
                if (values[i] !== 0) {
                    cellCopy[i].mutable = false
                } else {
                    cellCopy[i].mutable = true
                }
                cellCopy[i].value = values[i]
                cellCopy[i].solution = solutions[i]
                cellCopy[i].notes = [false, false, false,
                    false, false, false,
                    false, false, false]
                cellCopy[i].focused = false

            }
            return {
                ...state,
                cells: cellCopy,
                unsolved: unsolved,
                continueTime: true,
                abort: false,
                time: 0
            }
        }
        case 'cell/revealSolution': {
            if (state.cells[state.focused.id].mutable) {
                let cellCopy = [...state.cells]
                let solution = cellCopy[state.focused.id].solution
                let unsolved = state.unsolved
                unsolved--

                cellCopy[state.focused.id].value = solution
                cellCopy[state.focused.id].mutable = false
                let focusedCopy = { ...state.focused }
                focusedCopy.value = solution

                // delete all hints
                for (let i = state.focused.column * 9; i < state.focused.column * 9 + 9; i++) {
                    if (cellCopy[i].notes[solution]) {
                        cellCopy[i].notes[solution] = false
                    }
                }
                for (let i = state.focused.seat; i < 81 - 8 - state.focused.seat; i += 9) {
                    if (cellCopy[i].notes[solution]) {
                        cellCopy[i].notes[solution] = false
                    }
                }
                let adjustedSeat = state.focused.seat - state.focused.seat % 3
                let adjustedColumn = state.focused.column - state.focused.column % 3
                for (let i = adjustedSeat; i < adjustedSeat + 3; i++) {
                    for (let j = adjustedColumn; j < adjustedColumn + 3; j++) {
                        if (cellCopy[i + j * 9].notes[solution - 1]) {
                            cellCopy[i + j * 9].notes[solution - 1] = false
                        }
                    }

                }

                return {
                    ...state,
                    cells: cellCopy,
                    focused: focusedCopy,
                    unsolved: unsolved
                }
            } else {
                return state
            }
        }
        case 'cell/eraseCell': {
            if (state.cells[state.focused.id].mutable && state.cells[state.focused.id].value !== state.cells[state.focused.id].solution) {
                let cellCopy = [...state.cells]
                if (cellCopy[state.focused.id].value !== 0) {
                    cellCopy[state.focused.id].value = 0
                } else {
                    cellCopy[state.focused.id].notes = [false, false, false,
                        false, false, false,
                        false, false, false]
                }
                let focusedCopy = { ...state.focused }
                focusedCopy.value = action.payload

                return {
                    ...state,
                    cells: cellCopy,
                    focused: focusedCopy,
                }
            } else {
                return state
            }
        }
        case 'notes/notesToggled': {
            return {
                ...state,
                notes: !state.notes
            }
        }
        case 'focus/focusChanged': {
            let cellCopy = [...state.cells]
            if (state.abort || state.solved === 0) {
                return state
            }
            let undeletable
            if (state.focused.id !== -1) {
                cellCopy[state.focused.id].focused = false
            }
            cellCopy[action.payload.id].focused = true
            cellCopy = cellCopy.map(cell => {
                if (cell.value == action.payload.value || cell.notes[action.payload.value - 1] == true) {
                    return {
                        ...cell,
                        highlight: action.payload.value
                    }
                } else {
                    return {
                        ...cell,
                        highlight: 0
                    }
                }
            })
            if (cellCopy[action.payload.id].value === cellCopy[action.payload.id].solution || !cellCopy[action.payload.id].mutable) {
                undeletable = true
            } else {
                undeletable = false
            }
            return {
                ...state,
                cells: cellCopy,
                focused: action.payload,
                undeletable: undeletable
            }
        }
        case 'focus/reloadFocus': {
            let cellCopy = [...state.cells]
            if (state.focused.id !== -1) {
                cellCopy[state.focused.id].focused = false
            }
            cellCopy[state.focused.id].focused = true
            cellCopy = cellCopy.map(cell => {
                if (cell.value == state.focused.value || cell.notes[state.focused.value - 1] == true) {
                    return {
                        ...cell,
                        highlight: state.focused.value
                    }
                } else {
                    return {
                        ...cell,
                        highlight: 0
                    }
                }
            })
            return {
                ...state,
                cells: cellCopy,
            }
        }
        case 'number/numberEmitet': {
            let cellCopy = [...state.cells]
            let focusedCopy = { ...state.focused }
            let mistakes = state.mistakes
            let unsolved = state.unsolved
            let undeletable = false
            if (state.focused.id !== -1 && state.cells[state.focused.id].mutable) {
                if (state.notes) {
                    // check if note is possible
                    let prevent = false
                    for (let i = state.focused.column * 9; i < state.focused.column * 9 + 9; i++) {
                        if (cellCopy[i].value === action.payload) {
                            prevent = true
                            break
                        }
                    }
                    for (let i = state.focused.seat; i < 81 - 8 - state.focused.seat; i += 9) {
                        if (cellCopy[i].value === action.payload) {
                            prevent = true
                            break
                        }
                    }
                    let adjustedSeat = state.focused.seat - state.focused.seat % 3
                    let adjustedColumn = state.focused.column - state.focused.column % 3
                    for (let i = adjustedSeat; i < adjustedSeat + 3; i++) {
                        for (let j = adjustedColumn; j < adjustedColumn + 3; j++) {
                            if (cellCopy[i + j * 9].value === action.payload) {
                                prevent = true
                                break
                            }
                        }

                    }
                    if (!prevent) {
                        let notesState = cellCopy[state.focused.id].notes[action.payload - 1]
                        cellCopy[state.focused.id].notes[action.payload - 1] = !notesState
                    }
                } else {
                    if (action.payload === cellCopy[state.focused.id].solution) {
                        for (let i = state.focused.column * 9; i < state.focused.column * 9 + 9; i++) {
                            if (cellCopy[i].notes[action.payload - 1]) {
                                cellCopy[i].notes[action.payload - 1] = false
                            }
                        }
                        for (let i = state.focused.seat; i < 81 - 8 + state.focused.seat; i += 9) {
                            if (cellCopy[i].notes[action.payload - 1]) {
                                cellCopy[i].notes[action.payload - 1] = false
                            }
                        }
                        let adjustedSeat = state.focused.seat - state.focused.seat % 3
                        let adjustedColumn = state.focused.column - state.focused.column % 3
                        for (let i = adjustedSeat; i < adjustedSeat + 3; i++) {
                            for (let j = adjustedColumn; j < adjustedColumn + 3; j++) {
                                if (cellCopy[i + j * 9].notes[action.payload - 1]) {
                                    cellCopy[i + j * 9].notes[action.payload - 1] = false
                                }
                            }

                        }
                        unsolved--
                        undeletable = true

                        //check for win
                        if (unsolved === 0) {
                            console.log('win')
                        }
                    } else if (action.payload !== cellCopy[state.focused.id].value) {
                        mistakes++
                    }
                    cellCopy[state.focused.id].value = action.payload
                }
                focusedCopy.value = action.payload
            }
            return {
                ...state,
                cell: cellCopy,
                number: action.payload,
                focused: focusedCopy,
                mistakes: mistakes,
                unsolved: unsolved,
                undeletable: undeletable,
            }
        }
        case 'difficulty/increment': {
            let difficulty = state.difficulty
            if (difficulty < state.difficultyMap.length - 1) {
                difficulty++
            } else {
                difficulty = 0
            }
            return {
                ...state,
                difficulty: difficulty
            }
        }
        case 'difficulty/decrement': {
            let difficulty = state.difficulty
            if (difficulty > 0) {
                difficulty--
            } else {
                difficulty = state.difficultyMap.length - 1
            }
            return {
                ...state,
                difficulty: difficulty
            }
        }
        case 'game/saveProgress': {
            storeProgress(state)
            return state
        }
        case 'game/retrieveProgress': {
            if (action.payload !== null){
                return action.payload
            } else {
                return state
            }

        }
        case 'game/abort': {
            return {
                ...state,
                abort: true,
                continueTime: false,
                time: 0
            }
        }
        case 'time/save':{
            return {
                ...state,
                time: action.payload
            }
        }
        case 'time/start':{
            return {
                ...state,
                continueTime: true
            }
        }
        case 'time/end':{
            return {
                ...state,
                continueTime: false
            }
        }
        
        default:
            return state
    }
}

