// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from './02.extra-4'

function Board({history, setHistory, currentStep, setCurrentStep}) {
  const squares = history[currentStep]

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || false) {
      return
    }

    setHistory(prevHistory => {
      const historyCopy = prevHistory.slice(0, currentStep + 1)
      const newSquares = [...squares]
      newSquares[square] = nextValue

      const newHistory = [...historyCopy, newSquares]

      return newHistory
    })

    setCurrentStep(prevStep => prevStep + 1)
  }

  function restart() {
    setCurrentStep(0)
    setHistory([Array(9).fill(null)])
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ])
  const [currentStep, setCurrentStep] = React.useState(0)

  function calculateTitle(index) {
    if (index === 0) return 'Go to game start'
    return `Go to move #${index} ${index === currentStep ? '(current)' : ''}`
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          history={history}
          setHistory={setHistory}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
      <div className="game-history">
        <ol>
          {!!history.length &&
            history.map((h, index) => (
              <li key={calculateTitle(index)}>
                <button
                  disabled={index === currentStep}
                  onClick={() => {
                    setCurrentStep(index)
                    setHistory(prevHistory => prevHistory.slice(0, index + 1))
                  }}
                >
                  {calculateTitle(index)}
                </button>
              </li>
            ))}
        </ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
