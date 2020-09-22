import * as R from "rambda"
import React, {useEffect, useState} from "react"
import * as Cell from "../components/Cell"
import * as Board from "../components/Board"

export default function Layout() {
  return <>
    <GameView/>
  </>
}

// LOGIC ===========================================================================================
let Status = {
  Stopped: "Stopped",
  Running: "Running",
  Won: "Won",
  Lost: "Lost",
}

let initialBoard = [
  {symbol: "A", status: Cell.Status.Closed},
  {symbol: "A", status: Cell.Status.Closed},
  {symbol: "B", status: Cell.Status.Closed},
  {symbol: "B", status: Cell.Status.Closed},
  {symbol: "C", status: Cell.Status.Closed},
  {symbol: "C", status: Cell.Status.Closed},
]

let startGame = (state) => ({
  board: initialBoard,
  status: Status.Running,
})

let openCell = R.curry((i, state) => ({
  ...state,
  board: Board.setStatusAt(i, Cell.Status.Open, state.board),
}))

let succeedStep = (state) => ({
  ...state,
  board: Board.setStatusesBy(Cell.isOpen, Cell.Status.Done, state.board)
})

let failStep1 = (state) => ({
  ...state,
  board: Board.setStatusesBy(Cell.isOpen, Cell.Status.Failed, state.board),
})

let failStep2 = (state) => ({
  ...state,
  board: Board.setStatusesBy(Cell.isFailed, Cell.Status.Closed, state.board),
})

function GameView() {
  let [state, setState] = useState({
    board: initialBoard,
    status: Status.Running, // Status.Stopped
  })

  let {board, status} = state

  function handleStartingClick(i) {
    if (status != Status.Running) {
      setState(startGame)
    }
  }

  function handleRunningClick(i) {
    if (status == Status.Running) {
      setState(openCell(i))
    }
  }

  // Board handling
  useEffect(_ => {
    if (Board.areOpensEqual(board)) {
      setState(succeedStep)
    } else if (Board.areOpensDifferent(board)) {
      setState(failStep1)
      setTimeout(_ => {
        setState(failStep2)
      }, 500)
    }
  }, [board])

  return <div onClick={handleStartingClick}>
    <ScreenBoxView status={status} board={board} onClickAt={handleRunningClick}/>
  </div>
}

function ScreenBoxView({status, board, onClickAt}) {
  switch (status) {
    case Status.Running:
      return <Board.BoardView board={board} onClickAt={onClickAt}/>

    case Status.Stopped:
      return <Board.ScreenView className="gray">
        <div>
          <h1>Memory Game</h1>
          <p className="small" style={{textAlign: "center"}}>Click anywhere to start!</p>
        </div>
      </Board.ScreenView>

    case Status.Won:
      return <Board.ScreenView className="green">
        <div>
          <h1>Victory!</h1>
          <p className="small" style={{textAlign: "center"}}>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>

    case Status.Lost:
      return <Board.ScreenView className="red">
        <div>
          <h1>Defeat!</h1>
          <p className="small" style={{textAlign: "center"}}>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>
  }
}
