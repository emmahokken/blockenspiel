<script setup>
import { useGridStore } from '../stores/grid.js'

const gridStore = useGridStore()
gridStore.initGrid()


function getCellStyle(value) {
  if (value === null) return { backgroundColor: 'inherit' }	
    
  const hue = 30 + value * 20 % 360

  return {
    backgroundColor: `hsl(${hue}, 90%, 60%)`,
    color: 'black',
    transform: 'scale(1.0)',
  }
}

</script>

<template>
  <!-- TOP ROW -->
  <div class="w-full flex justify-between items-center p-4">
    <img src="../assets/vue.svg" alt="Vue logo" class="h-8 w-auto" />
    <h1 style="font-family: 'Courier New', Courier, monospace;">BLOCKENSPIEL</h1>
    <button
      class="dark:bg-purple-600 dark:hover:bg-purple-700
         bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded"
      @click="gridStore.resetGrid()"
    >
        Reset gridd
    </button>
  </div>

  <!-- GRID -->
  <div class="flex flex-col mt-4 min-w-full min-h-full">
    <div
      v-for="(row, rowIndex) in gridStore.grid"
      :key="rowIndex"
      class="flex"
    >
      <button
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        role="button"
        class="w-6 h-6 flex items-center justify-center text-s font-bold transition-all 
          duration-300 cursor-pointer border-2 border-gray-300 dark:border-gray-600 transition-colors"
        :style="getCellStyle(cell)"
        @click="gridStore.updateGrid(rowIndex, colIndex)"
      >
        {{ cell }}
      </button>
    </div>
  </div>
</template>


<style scoped>
</style>