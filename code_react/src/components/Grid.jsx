import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { initGrid, updateGrid, resetGrid } from '../store/grid';
import reactLogo from '../assets/react.svg'

export default function Grid() {

  const dispatch = useDispatch();

  const grid = useSelector((state) => state.grid.grid);
  const rows = useSelector((state) => state.grid.rows);
  const cols = useSelector((state) => state.grid.cols);


  useEffect(() => {
    dispatch(initGrid());
  }, [dispatch]);

  const getCellStyle = (value) => {
    if (value === null) return { backgroundColor: 'inherit' };

    const hue = (30 + (value * 20)) % 360;
    return {
      backgroundColor: `hsl(${hue}, 90%, 60%)`,
      color: 'black',
      transform: 'scale(1.0)',
    };
  };

  return (
    <div className="min-w-full min-h-full p-4">
      {/* TOP ROW */}
      <div className="w-full flex justify-between items-center p-4">
        <img src={reactLogo} alt="React logo" className="h-8 w-auto" />
        <h1 style={{ fontFamily: "'Courier New', Courier, monospace" }}>BLOCKENSPIEL</h1>
        <button
          className="dark:bg-purple-600 dark:hover:bg-purple-700
                  bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded"
          onClick={() => dispatch(resetGrid())}
        >
          Reset grid
        </button>
      </div>

      {/* GRID */}
      <div className="flex flex-col">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                style={getCellStyle(cell)}
                className="w-6 h-6 flex items-center justify-center text-s font-bold
                           transition-all duration-300 cursor-pointer border-2 border-gray-300 dark:border-gray-600 transition-colors"
                onClick={() => dispatch(updateGrid({ row: rowIndex, col: colIndex }))}
              >
                {cell !== null ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div >
  );
}