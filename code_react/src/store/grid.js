import { createSlice } from '@reduxjs/toolkit';

const FIB_SEQUENCE_LENGTH = 5
const MAX_FIB_VALUE = 10000
const fibCache = buildFibSlices(FIB_SEQUENCE_LENGTH, MAX_FIB_VALUE)

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
  return Array.from({ length: sizeY }, () =>
    Array.from({ length: sizeX }, () => null))
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
  console.log(seq.join(','), fibCache.has(seq.join(',')))
  return fibCache.has(seq.join(','))
}


const initialState = {
  rows: 50,
  cols: 50,
  grid: [],
};

const gridSlice = createSlice({
  name: 'grid',
  initialState: initialState,
  reducers: {
    initGrid(state) {
      state.grid = loadFromStorage() || createEmptyGrid(state.rows, state.cols)
    },
    resetGrid(state) {
      state.grid = createEmptyGrid(state.rows, state.cols)
      saveToStorage(state.grid)
    },
    updateGrid(state, action) {
      const { row, col } = action.payload;
      // Update rows
      state.grid[row] = state.grid[row].map((value) => value + 1);

      // Update columns except already updated row
      for (let r = 0; r < state.rows; r++) {
        if (r !== row) {
          state.grid[r][col] += 1;
        }
      }

      // Check for Fibonacci sequence
      checkGridForFib(state);
      console.log(state.grid[0][0]);

      // Update grid in storage
      saveToStorage(state.grid);
    },
  }
})

// Helper for reducer
function checkGridForFib(state) {
  // Iterate over all rows
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c <= state.cols - FIB_SEQUENCE_LENGTH; c++) {
      // Check if a specific row slice is in the Fibonacci sequence
      const rowSlice = state.grid[r].slice(c, c + FIB_SEQUENCE_LENGTH)
      if (rowSlice[0] > 0 && checkFib(rowSlice)) {
        for (let i = 0; i < FIB_SEQUENCE_LENGTH; i++) {
          state.grid[r][c + i] = null
        }
      }
    }
  }

  // Iterate over all columns
  for (let c = 0; c < state.cols; c++) {
    for (let r = 0; r <= state.rows - FIB_SEQUENCE_LENGTH; r++) {
      const colSlice = []
      for (let i = 0; i < FIB_SEQUENCE_LENGTH; i++) {
        colSlice.push(state.grid[r + i][c])
      }

      // Check if a specific column slice is in the Fibonacci sequence
      if (checkFib(colSlice)) {
        for (let i = 0; i < FIB_SEQUENCE_LENGTH; i++) {
          state.grid[r + i][c] = null
        }
      }
    }
  }

}

export const { initGrid, updateGrid, resetGrid } = gridSlice.actions;
export default gridSlice.reducer;

