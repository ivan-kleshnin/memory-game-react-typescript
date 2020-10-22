import * as R from "rambda"
import {FC} from "react"
import * as L from "../lib"
import * as Cell from "./Cell"

// LOGIC ===========================================================================================
// let cell1 = ...
// let board = [cell1, cell2, cell3, cell4, cell4, cell6]

export type Board = Cell.Cell[]

// number -> Board -> Cell.Status
export let getStatusAt = ((i : number) => (board : Board) : Cell.Status =>
  R.view(R.lensPath(`${i}.status`), board)
)

// number -> Cell.Status -> Board -> Board
export let setStatusAt = ((i : number) => (status : Cell.Status) => (board : Board) : Board =>
  R.set(R.lensPath(`${i}.status`), status, board)
)

// Cell.PredFn -> Cell.Status -> Board -> Cell.Status[]
export let getStatusesBy = ((predFn : Cell.PredFn) => (board : Board) : Cell.Status[] =>
  R.chain((cell : Cell.Cell) => predFn(cell) ? [cell.status] : [], board)
)

// Cell.PredFn -> Cell.Status -> Board -> Board
export let setStatusesBy = ((predFn : Cell.PredFn) => (status : Cell.Status) => (board : Board) : Board =>
  R.map((cell : Cell.Cell) => predFn(cell) ? {...cell, status} : cell, board)
)

// Cell.PredFn -> Cell.Status -> Board -> Cell.Symbol[]
export let getSymbolsBy = ((predFn : Cell.PredFn) => (board : Board) : string[] =>
  R.chain(cell => predFn(cell) ? [cell.symbol] : [], board)
)

// number -> Board -> boolean
export let canOpenAt = ((i : number) => (board : Board) : boolean =>
  i < board.length
    && Cell.isClosed(board[i])
    && getStatusesBy(Cell.isBlocking)(board).length < 2
)

// Board -> boolean
export let areOpensEqual = ((board : Board) : boolean => {
  let openSymbols = getSymbolsBy(Cell.isOpen)(board)
  return openSymbols.length >= 2 && L.allEquals(openSymbols)
})

// Board -> boolean
export let areOpensDifferent = (board : Board) : boolean => {
  let openSymbols = getSymbolsBy(Cell.isOpen)(board)
  return openSymbols.length >= 2 && !L.allEquals(openSymbols)
}

let charCodeA = "A".charCodeAt(0)

// number -> number -> Board
export let makeRandom = (m : number, n : number) : Board => {
  if ((m * n / 2) > 26) throw new Error("too big")
  if ((m * n) % 2) throw new Error("must be even")
  return R.pipe(
    () => R.range(0, m * n / 2), // [0, 1, 2, ...]
    R.map((i : number) => String.fromCharCode(i + charCodeA)), // ["A", "B", "C", ...]
    R.chain(x => [x, x]), // ["A", "A", "B", "B", ...]
    L.shuffle,            // ["A", "C", "B", "D", ...]
    R.map((symbol : string) => ({symbol, status: Cell.Status.Closed})),
  )() as Board
}

// VIEW ============================================================================================
type BoardViewProps = {
  board : Board
  onClickAt : (i : number) => void
}

// BoardViewProps -> JSX
export let BoardView : FC<BoardViewProps> = ({board, onClickAt}) => {
  return <>
    <div className="board">
      {board.map((cell, i) =>
        <Cell.CellView key={i} cell={cell} onClick={_ => onClickAt(i)}/>
      )}
    </div>
    <style jsx>{`
      .board {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        width: 640px;
        height: 480px;
        gap: 2px;
      }
    `}</style>
  </>
}

type ScreenViewProps = {
  background: string,
}

// ScreenViewProps -> JSX
export let ScreenView : FC<ScreenViewProps> = ({background, children}) => {
  return <>
    <div className="screen">
      {children}
    </div>
    <style jsx>{`
      .screen {
        display: flex;
        width: 640px;
        height: 480px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: ${background};
      }

      :global(.screen h1) {
        font-size: 3rem;
      }
    `}</style>
  </>
}
