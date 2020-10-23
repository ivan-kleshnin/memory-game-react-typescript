import * as R from "rambda"
import * as React from "react"
import * as Cell from "./Cell"
import * as Board from "./Board"

// LOGIC ===========================================================================================
export enum Status {
  Stopped, Running, Won, Lost
}

export type State = {
  board : Board.Board
  secondsLeft : number
  status : Status
}

let startGame = () : State => ({
  board: Board.makeRandom(4, 3),
  secondsLeft: 60,
  status: Status.Running,
})

let openCell = (i : number) => (state : State) : State => (
  {...state, board: Board.setStatusAt(i)(Cell.Status.Open)(state.board)}
)

let canOpenCell = (i : number) => (state : State) : boolean => (
  Board.canOpenAt(i)(state.board)
)

let succeedStep = (state : State) : State => (
  {...state, board: Board.setStatusesBy(Cell.isOpen)(Cell.Status.Done)(state.board)}
)

let failStep1 = (state : State) : State => (
  {...state, board: Board.setStatusesBy(Cell.isOpen)(Cell.Status.Failed)(state.board)}
)

let failStep2 = (state : State) : State => (
  {...state, board: Board.setStatusesBy(Cell.isFailed)(Cell.Status.Closed)(state.board)}
)

let hasWinningCond = (state : State) : boolean => (
  R.filter(Cell.isDone, state.board).length == state.board.length
)

let hasLosingCond = (state : State) : boolean => (
  !state.secondsLeft
)

let setStatus = (status : Status) => (state : State) : State => (
  {...state, status}
)

let nextSecond = (state : State) : State => (
  {...state, secondsLeft: Math.max(state.secondsLeft - 1, 0)}
)

// VIEW ============================================================================================
let GameView : React.FC = () => {
  let [state, setState] = React.useState<State>({
    ...startGame(),
    status: Status.Stopped,
  })

  let {board, status, secondsLeft} = state

  // INPUT HANLDING
  let handleStartingClick = () => {
    if (status != Status.Running) {
      setState(startGame)
    }
  }

  let handleRunningClick = (i : number) => {
    if (status == Status.Running && canOpenCell(i)(state)) {
      setState(openCell(i))
    }
  }

  // WIN/LOSE MECHANICS
  React.useEffect(() => {
    if (status == Status.Running) {
      if (hasWinningCond(state)) {
        return setState(setStatus(Status.Won))
      }
      else if (hasLosingCond(state)) {
        return setState(setStatus(Status.Lost))
      }
    }
  }, [state])

  React.useEffect(() => {
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
  React.useEffect(() => {
    let timer : ReturnType<typeof setInterval> | undefined = undefined
    if (status == Status.Running && !timer) {
      timer = setInterval(() => {
        setState(nextSecond)
      }, 1000)
    }
    return () => {
      timer ? clearInterval(timer) : null
    }
  }, [status])

  return <div onClick={_ => handleStartingClick()}>
    <StatusLineView status={status} secondsLeft={secondsLeft}/>
    <ScreenBoxView status={status} board={board} onClickAt={handleRunningClick}/>
  </div>
}

type StatusLineViewProps = {
  status : Status
  secondsLeft : number
}

let StatusLineView : React.FC<StatusLineViewProps> = ({status, secondsLeft}) => {
  return <>
    <div className="status-line">
      <div>{status == Status.Running ? ":)" : "Lets Go!"}</div>
      <div className="timer">
        {status == Status.Running && `Seconds left: ${secondsLeft}`}
      </div>
    </div>
    <style jsx>{`
      .status-line {
        color: gray;
        display: flex;
        justify-content: space-between;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
    `}</style>
  </>
}

type ScreenBoxViewProps = {
  status : Status
  board : Board.Board
  onClickAt : (i : number) => void
}

let ScreenBoxView : React.FC<ScreenBoxViewProps> = ({status, board, onClickAt}) => {
  switch (status) {
    case Status.Running:
      return <Board.BoardView board={board} onClickAt={onClickAt}/>

    case Status.Stopped:
      return <Board.ScreenView background={statusToBackground(status)}>
        <div style={{textAlign: "center"}}>
          <h1>Memory Game</h1>
          <p>Click anywhere to start!</p>
        </div>
      </Board.ScreenView>

    case Status.Won:
      return <Board.ScreenView background={statusToBackground(status)}>
        <div style={{textAlign: "center"}}>
          <h1>Victory!</h1>
          <p>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>

    case Status.Lost:
      return <Board.ScreenView background={statusToBackground(status)}>
        <div style={{textAlign: "center"}}>
          <h1>Defeat!</h1>
          <p>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>
  }
}

let statusToBackground = (status : Status) : string => {
  switch (status) {
    case Status.Won:  return "#a8db8f"
    case Status.Lost: return "#db8f8f"
    default:          return "#dcdcdc"
  }
}

export {GameView}
