import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGridStore, generateFibSequence, checkFib, buildFibSlices } from '../stores/grid.js'

describe('Grid Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes grid with null values', () => {
    const store = useGridStore()
    store.initGrid()
    expect(store.grid.length).toBe(store.rows)
    expect(store.grid[0].length).toBe(store.cols)
    expect(store.grid.every(row => row.every(cell => cell === null))).toBe(true)
  })

  it('increments row and column on click', () => {
    const store = useGridStore()
    store.initGrid()
    store.updateGrid(2, 3)

    // All cells in row 2 should be 1
    expect(store.grid[2].every(cell => cell === 1)).toBe(true)

    const rowValues = store.grid[2]
    const colValues = store.grid.map(row => row[3])

    for (let val of rowValues) {
      expect(val).toBe(1)
    }
    for (let val of colValues) {
      expect(val).toBe(1)
    }
  })

  it('detects Fibonacci sequence', () => {
    buildFibSlices(5, 10000)
    const fibRow = [1, 1, 2, 3, 5]
    expect(checkFib(fibRow)).toBe(true)
  })

  it('detects Fibonacci sequence higher up', () => {
    const fibRow = [144, 233, 377, 610, 987]
    expect(checkFib(fibRow)).toBe(true)
  })

  it('detects and nulls a Fibonacci sequence in a row', () => {
    const store = useGridStore()
    store.initGrid()
    store.grid[0].splice(0, 5, 1, 1, 2, 3, 5)

    store.checkGridForFib()

    expect(store.grid[0].slice(0, 5)).toEqual([null, null, null, null, null])
  })
    
  it('detects and nulls a Fibonacci sequence in a row', () => {
    const store = useGridStore()
    store.initGrid()
    store.grid[0].splice(0, 5, 144, 233, 377, 610, 987)

    store.checkGridForFib()

    expect(store.grid[0].slice(0, 5)).toEqual([null, null, null, null, null])
  })

  it('rejects non-Fibonacci sequence', () => {
    const store = useGridStore()
    const fibRow = [1, 6, 8, 5, 9]
    expect(checkFib(fibRow)).toBe(false)
  })

  it('rejects alternative non-Fibonacci sequence', () => {
    const store = useGridStore()
    const fibRow = [2, 2, 4, 6, 10]
    expect(checkFib(fibRow)).toBe(false)
  })

  it('detects and nulls a Fibonacci sequence in a column', () => {
    const store = useGridStore()
    store.initGrid()
    for (let i = 0; i < 5; i++) {
        store.grid[i][0] = [1, 1, 2, 3, 5][i]
    }

    store.checkGridForFib()

    for (let i = 0; i < 5; i++) {
        expect(store.grid[i][0]).toBe(null)
    }
  })

  it('resets the grid to all null values', () => {
    const store = useGridStore()
    store.initGrid()
    store.updateGrid(0, 0)

    store.resetGrid()

    expect(store.grid.every(row => row.every(cell => cell === null))).toBe(true)
  })

  it('generates fibonacci sequence', () => {
    expect(generateFibSequence(10)).toStrictEqual([0, 1, 1, 2, 3, 5, 8, 13])
  })
})