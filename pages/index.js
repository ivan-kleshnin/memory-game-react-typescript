import * as R from "rambda"
import React, {useState} from "react"
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

let startGame = (state) => ({
  status: Status.Running,
})

function GameView() {
  let cellA1 = {symbol: "A", status: Cell.Status.Closed}
  let cellA2 = {symbol: "A", status: Cell.Status.Closed}
  let cellB1 = {symbol: "B", status: Cell.Status.Closed}
  let cellB2 = {symbol: "B", status: Cell.Status.Closed}
  let cellC1 = {symbol: "C", status: Cell.Status.Closed}
  let cellC2 = {symbol: "C", status: Cell.Status.Closed}
  let board = [
    cellA1, cellA2, cellB1, cellB2, cellC1, cellC2,
  ]

  let [state, setState] = useState({
    status: Status.Stopped,
  })

  let {status} = state

  function handleStartingClick(i) {
    if (status != Status.Running) {
      setState(startGame)
    }
  }

  return <div onClick={handleStartingClick}>
    <ScreenBoxView status={status} board={board}/>
  </div>
}

function ScreenBoxView({status, board}) {
  switch (status) {
    case Status.Running:
      return <Board.BoardView board={board} onClickAt={() => null}/>

    case Status.Stopped:
      return <Board.ScreenView className="gray">
        <div style={{textAlign: "center"}}>
          <h1>Memory Game</h1>
          <p>Click anywhere to start!</p>
        </div>
      </Board.ScreenView>

    case Status.Won:
      return <Board.ScreenView className="green">
        <div style={{textAlign: "center"}}>
          <h1>Victory!</h1>
          <p>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>

    case Status.Lost:
      return <Board.ScreenView className="red">
        <div style={{textAlign: "center"}}>
          <h1>Defeat!</h1>
          <p>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>
  }
}
