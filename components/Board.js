import * as R from "rambda"
import React from "react"
import * as L from "../lib"
import * as Cell from "./Cell"

// LOGIC ===========================================================================================
// let cell1 = ...
// let board = [cell1, cell2, cell3, cell4, cell4, cell6]

export let getStatusAt = R.curry((i, board) => {
  return R.view(R.lensPath(`${i}.status`), board)
})

export let setStatusAt = R.curry((i, status, board) => {
  return R.set(R.lensPath(`${i}.status`), status, board)
})

export let setStatusesBy = R.curry((predFn, status, board) => {
  return R.map(cell => predFn(cell) ? {...cell, status} : cell, board)
})

export let getStatusesBy = R.curry((predFn, board) => {
  return R.chain(cell => predFn(cell) ? [cell.status] : [], board)
})

export let getSymbolsBy = R.curry((predFn, board) => {
  return R.chain(cell => predFn(cell) ? [cell.symbol] : [], board)
})

export let canOpenAt = R.curry((i, board) => {
  return i < board.length
    && Cell.isClosed(board[i])
    && getStatusesBy(Cell.isBlocking, board).length < 2
})

export let areOpensEqual = (board) => {
  let openSymbols = getSymbolsBy(Cell.isOpen, board)
  return openSymbols.length >= 2 && L.allEquals(openSymbols)
}

export let areOpensDifferent = (board) => {
  let openSymbols = getSymbolsBy(Cell.isOpen, board)
  return openSymbols.length >= 2 && !L.allEquals(openSymbols)
}

// VIEW ============================================================================================
export function BoardView({board, onClickAt}) {
  return <div className="board">
    {board.map((cell, i) =>
      <Cell.View key={i} cell={cell} onClick={_ => onClickAt(i)}/>
    )}
  </div>
}

export function ScreenView({className, children}) {
  return <div className={`screen ${className}`}>
    {children}
  </div>
}
