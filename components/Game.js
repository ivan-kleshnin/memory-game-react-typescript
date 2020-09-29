import * as R from "rambda"
import React, {useEffect, useState} from "react"
import * as Cell from "./Cell"
import * as Board from "./Board"

// LOGIC ===========================================================================================
let Status = {
  Stopped: "Stopped",
  Running: "Running",
  Won: "Won",
  Lost: "Lost",
}

let startGame = (state) => ({
  board: Board.makeRandom(4, 3),
  secondsLeft: 60,
  status: Status.Running,
})

let openCell = R.curry((i, state) => ({
  ...state, board: Board.setStatusAt(i, Cell.Status.Open, state.board),
}))

let canOpenCell = R.curry((i, state) => {
  return Board.canOpenAt(i, state.board)
})

let succeedStep = (state) => ({
  ...state, board: Board.setStatusesBy(Cell.isOpen, Cell.Status.Done, state.board)
})

let failStep1 = (state) => ({
  ...state, board: Board.setStatusesBy(Cell.isOpen, Cell.Status.Failed, state.board),
})

let failStep2 = (state) => ({
  ...state, board: Board.setStatusesBy(Cell.isFailed, Cell.Status.Closed, state.board),
})

let hasWinningCond = (state) => (
  R.filter(Cell.isDone, state.board).length == state.board.length
)

let hasLosingCond = (state) => !state.secondsLeft

let setStatus = R.curry((status, state) => ({...state, status}))

let nextSecond = (state) => ({
  ...state, secondsLeft: Math.max(state.secondsLeft - 1, 0),
})

// VIEW ============================================================================================
export function View() {
  let [state, setState] = useState({
    ...startGame(),
    status: Status.Stopped,
  })

  let {board, status, secondsLeft} = state

  // INPUT HANLDING
  function handleStartingClick(i) {
    if (status != Status.Running) {
      setState(startGame)
    }
  }

  function handleRunningClick(i) {
    if (status == Status.Running && canOpenCell(i, state)) {
      setState(openCell(i))
    }
  }

  // WIN/LOSE MECHANICS
  useEffect(_ => {
    if (status == Status.Running) {
      if (hasWinningCond(state)) {
        return setState(setStatus(Status.Won))
      }
      else if (hasLosingCond(state)) {
        return setState(setStatus(Status.Lost))
      }
    }
  }, [state])

  useEffect(_ => {
    if (status == Status.Running) {
      if (Board.areOpensEqual(board)) {
        setState(succeedStep)
      } else if (Board.areOpensDifferent(board)) {
        setState(failStep1)
        setTimeout(_ => {
          setState(failStep2)
        }, 500)
      }
    }
  }, [board])

  // TIMER
  useEffect(_ => {
    let timer = null
    if (status == Status.Running && !timer) {
      timer = setInterval(() => {
        setState(nextSecond)
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [status])

  return <div onClick={handleStartingClick}>
    <StatusLineView status={status} secondsLeft={secondsLeft}/>
    <ScreenBoxView status={status} board={board} onClickAt={handleRunningClick}/>
  </div>
}

function StatusLineView({status, secondsLeft}) {
  return <div className="status-line">
    <div>{status == Status.Running ? ":)" : "Lets Go!"}</div>
    <div className="timer">
      {status == Status.Running && `Seconds left: ${secondsLeft}`}
    </div>
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
