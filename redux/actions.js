export const cellValueChanged = {
    type: 'cell/cellValueChanged',
    payload: {
        id: id,
        value: value,
    },
}

export const cellNotesChanged = {
    type: 'cell/cellNotesChanged',
    payload: {
        id: id,
        notes: notes,
    },
}

export const cellSolutionChanged = {
    type: 'cell/cellSolutionChanged',
    payload: {
        id: id,
        solution: solution,
    },
} 

export const loadCells = {
    type: 'cell/loadCells',
    payload: {
        values: values,
        solutions: solutions
    }
}

export const revealSolution = {
    type: 'cell/revealSolution',
    payload: cellId
}

export const eraseCell = {
    type: 'cell/eraseCell',
}

export const notesToggled = {
    type: 'notes/notesToggled',
}

export const focusChanged = {
    type: 'focus/focusChanged',
    payload: id,
}

export const reloadFocus = {
    type: 'focus/reloadFocus',
}

export const numberEmitet = {
    type: 'number/numberEmitet',
    payload: number,
}