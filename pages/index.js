import React from "react"
import * as Cell from "../components/Cell"

export default function Layout() {
  let cellOpen = {symbol: "A", status: Cell.Status.Open}
  let cellClosed = {symbol: "B", status: Cell.Status.Closed}
  let cellFailed = {symbol: "C", status: Cell.Status.Failed}
  let cellDone =  {symbol: "D", status: Cell.Status.Done}

  return <div>
    <Cell.View cell={cellOpen}/>
    <Cell.View cell={cellClosed}/>
    <Cell.View cell={cellFailed}/>
    <Cell.View cell={cellDone}/>
  </div>
}
