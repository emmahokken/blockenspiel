import { defineStore } from 'pinia'

const FIB_SEQUENCE_LENGTH = 8
const MAX_FIB_VALUE = 10000
const fibCache = buildFibSlices(FIB_SEQUENCE_LENGTH, MAX_FIB_VALUE)

export const useGridStore = defineStore('grid', {
    state: () => ({
        rows: 50,
        cols: 50,
        grid: [],
    }),
    actions: {
        initGrid() {
            this.grid =  loadFromStorage() || createEmptyGrid(this.rows, this.cols)
        },
        updateGrid(row, col) {
            // Update rows 
            this.grid[row] = this.grid[row].map(value => value + 1)

            // Update columns except already updated row
            for (let r = 0; r < this.rows; r++) {
                if (r !== row) {
                   this.grid[r][col] += 1
                }
            }

            // Check for Fibonacci sequence
            this.checkGridForFib()

            // Update grid in storage
            saveToStorage(this.grid)
        },
        resetGrid() {
            this.grid = createEmptyGrid(this.rows, this.cols)
            saveToStorage(this.grid)
        },
        checkGridForFib() {
            // Iterate over all rows
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c <= this.cols - FIB_SEQUENCE_LENGTH; c++) {
                    // Check if a specific row slice is in the Fibonacci sequence
                    const rowSlice = this.grid[r].slice(c, c + FIB_SEQUENCE_LENGTH)
                    if (rowSlice[0] > 0 && checkFib(rowSlice)) {
                        for (let i = 0; i < FIB_SEQUENCE_LENGTH; i++) {
                            this.grid[r][c + i] = null
                        }
                    }
                }    
            }

            // Iterate over all columns
            for (let c = 0; c < this.cols; c++) {
                for (let r = 0; r <= this.rows - FIB_SEQUENCE_LENGTH; r++) {
                    const colSlice = []
                    for (let i = 0; i < FIB_SEQUENCE_LENGTH; i++) {
                        colSlice.push(this.grid[r + i][c])
                    }

                    // Check if a specific column slice is in the Fibonacci sequence
                    if (checkFib(colSlice)) {
                        for (let i = 0; i < FIB_SEQUENCE_LENGTH; i++) {
                            this.grid[r + i][c] = null
                        }
                    }
                }
            }
            
        }
    }
})

// HELPER FUNCTIONS 

// Storage
function loadFromStorage() {
    const JSONGrid = localStorage.getItem('grid')
    return JSONGrid ? JSON.parse(JSONGrid) : null
}

function saveToStorage(grid) {
    localStorage.setItem('grid', (JSON.stringify(grid)))
}

// Grid builder
function createEmptyGrid(sizeX, sizeY) {
    return Array.from({length: sizeY}, () => 
        Array.from({length: sizeX}, () => null))    
}

// Fibonacci 
function generateFibSequence(max) {
    const fib = [0, 1]
    while (fib[fib.length - 1] < max) {
        fib.push(fib[fib.length - 1] + fib[fib.length - 2])
    }
    return fib
}

function buildFibSlices(length, max) {
    // Build a cache will all possible fibonacci sequences for easier computing
    const fib = generateFibSequence(max)
    const sliceSet = new Set()

    for (let i = 0; i <= fib.length - length; i++) {
        sliceSet.add(fib.slice(i, i + length).join(','))
    }
    return sliceSet
}

function checkFib(seq) {
    return fibCache.has(seq.join(','))
}

export {
  checkFib,
  buildFibSlices,
  generateFibSequence,
}