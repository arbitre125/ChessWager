import React from "react"

import "../../config"

import firebase from "firebase/compat/app"
import { useCollectionData } from "react-firebase-hooks/firestore"
import Bet from "./Bet"

import WagerForm from "./WagerForm"
import { FirebaseError } from "@firebase/util"
import { GameId } from "../containers/GameId"
import { AuthContainer } from "../containers/Auth"

const firestore = firebase.firestore() //@todo move into parent, use redux

interface Lobby {
  id: string
  amount: number
  betSide: string
  multiplier: number
  status: string
  user1Id: string
  user1Metamask: string
  user1PhotoURL: string
  user2Id: string
  user2Metamask: string
  user2PhotoURL: string
  createdAt: Date
  gameId: string
}

const BettingLobby: React.FC = () => {
  const {user, auth} = AuthContainer.useContainer()
  const gameIdContainer = GameId.useContainer() // @todo const?


  const lobbyRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData> =
    firestore.collection("lobby") //@todo order by created at
  //const query = lobbyRef.where("status", "!=", "complete") //.where("status", "==", "ready") //.orderBy("createdAt", "desc").limit(10) //.where("status", "==", "active")
  const query = lobbyRef.where("gameId", "==", gameIdContainer.gameId)
// @todo make query by time range(time most recent game was started, )
// ref.orderBy().startAt(call to db, new Date() when ).endAt(never)

  const [lobby]: [Lobby[] | undefined, boolean, FirebaseError | undefined] =
    useCollectionData(query, { idField: "id" })

  let userId = ""
  if (auth.currentUser) {
    const { uid }: firebase.User = auth.currentUser
    userId = uid
  }

  return (
    <div className="lobby">
      <header>
        {/* @todo! add column names allowing sorting */}
        {/* @todo make css grid to bottom of container, consider putting at the top so new bets cascade downwards */}
        <WagerForm lobbyRef={lobbyRef} auth={auth} />
      </header>
      <main>
        <div className="lobby-container">
          {lobby && user && // get related-to-user games
            lobby
              .filter(i => i.user1Id === userId || i.user2Id === userId)
              .map(bet => (
                <Bet
                  className="in-progress-bet"
                  lobbyRef={lobbyRef}
                  key={bet.id}
                  id={bet.id}
                  amount={bet.amount}
                  betSide={bet.betSide}
                  multiplier={bet.multiplier}
                  status={bet.status}
                  user1Id={bet.user1Id}
                  user1Metamask={bet.user1Metamask}
                  user1PhotoURL={bet.user1PhotoURL}
                  user2Id={bet.user2Id}
                  user2Metamask={bet.user2Metamask}
                  user2PhotoURL={bet.user2PhotoURL}
                  createdAt={bet.createdAt}
                  gameId={bet.gameId}
                />
              ))}
          {lobby &&
            lobby
              .filter(
                i =>
                  i.status === "ready" &&
                  i.user1Id !== userId &&
                  i.user2Id !== userId
              )
              .map(bet => (
                <Bet
                  className="ready-bet"
                  lobbyRef={lobbyRef}
                  key={bet.id}
                  id={bet.id}
                  amount={bet.amount}
                  betSide={bet.betSide}
                  multiplier={bet.multiplier}
                  status={bet.status}
                  user1Id={bet.user1Id}
                  user1Metamask={bet.user1Metamask}
                  user1PhotoURL={bet.user1PhotoURL}
                  user2Id={bet.user2Id}
                  user2Metamask={bet.user2Metamask}
                  user2PhotoURL={bet.user2PhotoURL}
                  createdAt={bet.createdAt}
                  gameId={bet.gameId}
                />
              ))}
          {lobby &&
            lobby
              .filter(
                i =>
                  i.status === "pending" &&
                  i.user1Id !== userId &&
                  i.user2Id !== userId
              )
              .map(bet => (
                <Bet
                  className="pending-bet"
                  lobbyRef={lobbyRef}
                  key={bet.id}
                  id={bet.id}
                  amount={bet.amount}
                  betSide={bet.betSide}
                  multiplier={bet.multiplier}
                  status={bet.status}
                  user1Id={bet.user1Id}
                  user1Metamask={bet.user1Metamask}
                  user1PhotoURL={bet.user1PhotoURL}
                  user2Id={bet.user2Id}
                  user2Metamask={bet.user2Metamask}
                  user2PhotoURL={bet.user2PhotoURL}
                  createdAt={bet.createdAt}
                  gameId={bet.gameId}
                />
              ))}
        </div>
      </main>
      <footer></footer>
    </div>
  )
}

export default BettingLobby
