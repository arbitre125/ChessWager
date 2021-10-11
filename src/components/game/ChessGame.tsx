import firebase from "firebase/compat"
import React, { useEffect, useState } from "react"
// @ts-ignore
import Chessground from "react-chessground"
// @ts-ignore
import ndjsonStream from "can-ndjson-stream"
import "react-chessground/dist/styles/chessground.css"
import "../../style/game.css"
import PlayerData from "./PlayerData"

interface Featured {
  t: string
  d: {
    id: string
    orientation: string //black /white
    players: Player[]
    fen: string
    wc: number
    bc: number
  }
}

interface Player {
  color: string
  user: {
    name: string
    id: string
    title: string
  }
  rating: number
}

// interface Fen {
//   value: {
//     d: {
//       fen: string
//       bc: string
//       wc: string
//     }
//   }
// }

const ChessGame: React.FC = () => {
  const clearBets = firebase.functions().httpsCallable("clearAllActiveBets")

  const [fen, setFen] = useState("")
  const [gameId, setGameId] = useState("")

  const [whiteName, setWhiteName] = useState("")
  const [whiteTime, setWhiteTime] = useState(0)
  const [whiteRating, setWhiteRating] = useState(0)
  const [whiteTitle, setWhiteTitle] = useState("")

  const [blackName, setBlackName] = useState("")
  const [blackTime, setBlackTime] = useState(0)
  const [blackRating, setBlackRating] = useState(0)
  const [blackTitle, setBlackTitle] = useState("")
  const [orientation, setOrientation] = useState("white")

  const updateTitles = (res: Featured): void => {
    const white: Player | undefined = res.d.players.find(
      player => player.color === "white"
    )
    const black: Player | undefined = res.d.players.find(
      player => player.color === "black"
    )

    if (black === undefined || white === undefined) return

    setFen(res.d.fen)
    setGameId(res.d.id)
    setOrientation(res.d.orientation)

    if (white.user.title === undefined) setWhiteTitle("")
    setWhiteName(white.user.name)
    setWhiteRating(white.rating)

    if (black.user.title === undefined) setBlackTitle("")
    setBlackName(black.user.name)
    setBlackRating(black.rating)

    return
  }

  useEffect(() => {
    fetch("https://lichess.org/api/tv/feed", {
      method: "get",
    })
      .then(data => ndjsonStream(data.body))
      .then(stream => {
        const streamReader = stream.getReader()
        streamReader.read().then(async (res: Featured | any) => {
          updateTitles(res.value)
          while (!res || !res.done) {
            res = await streamReader.read()
            if (res.value.t === "fen") {
              setFen(res.value.d.fen)
              setWhiteTime(res.value.d.wc)
              setBlackTime(res.value.d.bc)
            } else {
              updateTitles(res.value)
            }
          }
        })
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const lichessUrl = "https://lichess.org/" + gameId

  return (
    <div id="chess-board">
      {/* @todo remove in prod */}
      {/* <button onClick={_e => clearBets()} style={{ float: "right" }}>
        clear
      </button> */}

      <a href={lichessUrl} style={{ float: "right" }}>
        Check out the game on lichess
      </a>

      <PlayerData
        side={orientation === "white" ? "black" : "white"}
        title={orientation === "white" ? blackTitle : whiteTitle}
        name={orientation === "white" ? blackName : whiteName}
        time={orientation === "white" ? blackTime : whiteTime}
        rating={orientation === "white" ? blackRating : whiteRating}
        fen={fen}
      />
      <Chessground
        width="40em"
        height="40em"
        viewOnly={true}
        id="chess-board"
        fen={fen}
        orientation={orientation}
      />
      <PlayerData
        side={orientation === "white" ? "white" : "black"}
        title={orientation === "black" ? blackTitle : whiteTitle}
        name={orientation === "black" ? blackName : whiteName}
        time={orientation === "black" ? blackTime : whiteTime}
        rating={orientation === "black" ? blackRating : whiteRating}
        fen={fen}
      />
    </div>
  )
}

export default ChessGame
