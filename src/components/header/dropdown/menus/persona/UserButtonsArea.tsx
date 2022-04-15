import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getFirestore,
} from "firebase/firestore"
import { firebaseApp } from "../../../../../config"
import { Auth } from "../../../../containers/Auth"
import { AddFriendButton } from "./buttons/AddFriendButton"
import { BlockUserButton } from "./buttons/BlockUserButton"
import { ReportUserButton } from "./buttons/ReportUserButton"
import { SendMessageButton } from "./buttons/SendMessageButton"
import { BlockedButton } from "./buttons/BlockedButton"
import { BsWallet2 } from "react-icons/bs"
import { useState } from "react"
import { RemoveFriendButton } from "./buttons/RemoveFriendButton"
import { CancelPendingRequestButton } from "./buttons/CancelPendingRequestButton"
import { FriendRequestsButton } from "./buttons/FriendRequestsButton"
import { UserDataState } from "../../../../containers/UserDataState"
import { useDocumentDataOnce } from "react-firebase-hooks/firestore"
import { Friend } from "../../../../../interfaces/Friend"

const db = getFirestore(firebaseApp)

interface Props {
  id: string
  displayName: string
  photoURL: string
  activeMenu: string
  walletAddress: string
}

export const UserButtonsArea: React.FC<Props> = ({
  id,
  displayName,
  photoURL,
  activeMenu,
  walletAddress,
}) => {
  const { userData } = UserDataState.useContainer()
  const { auth, isWalletConnected } = Auth.useContainer()
  // const friend = useDocumentDataOnce<Friend | DocumentData>(
  //   doc(db, "users", auth.currentUser!.uid, "friends", userData!.id),
  // )
  const isFriend = userData!.friends.includes(id)

  const isUser = auth.currentUser?.uid === id
  const userDoc = doc(db, "users", auth.currentUser!.uid)
  const blockedUsers = collection(userDoc, "blocked")

  return (
    <>
      <>
        {!isUser && displayName !== "" && (
          <div className="h-22 my-1 flex w-full justify-between">
            <div className="flex gap-3">
              <SendMessageButton
                id={id ?? ""}
                displayName={displayName}
                photoURL={photoURL}
                activeMenu={activeMenu}
              />
              {(!userData!.sentFriendRequests.includes(id) ||
                userData!.redactedFriendRequests.includes(id)) &&
                !isFriend && <AddFriendButton id={id ?? ""} />}

              {userData!.sentFriendRequests.includes(id) &&
                !userData!.redactedFriendRequests.includes(id) &&
                !isFriend && (
                  <CancelPendingRequestButton
                    className="text-green-700 dark:text-green-300 hover:text-green-700 dark:hover:text-green-300"
                    id={id}
                  />
                )}
            </div>

            <div className="flex gap-3">
              {isFriend && <RemoveFriendButton id={id} />}
              <BlockUserButton
                id={id ?? ""}
                displayName={displayName}
                photoURL={photoURL}
                blockedUsers={blockedUsers}
              />
              <ReportUserButton id={id ?? ""} activeMenu={activeMenu} />
            </div>
          </div>
        )}
      </>
      <>
        {isUser && (
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <FriendRequestsButton />
              <BlockedButton />
            </div>
            {isWalletConnected && (
              <>
                <a
                  className="rounded-full border border-stone-400 dark:border-stone-800 py-1 px-2 bg-white hover:underline dark:bg-stone-800 dark:hover:text-stone-200 text-xs color-shift hover:text-black hover:border-black dark:hover:border-white"
                  title={"View Wallet on Snowtrace"}
                  href={"https://snowtrace.io/address/" + walletAddress}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="flex gap-1">
                    <div className="mt-0.5">
                      <BsWallet2 />
                    </div>
                    {walletAddress?.substring(0, 6)}...
                    {walletAddress?.substring(
                      walletAddress.length - 4,
                      walletAddress.length,
                    )}
                  </div>
                </a>
              </>
            )}
          </div>
        )}
      </>
    </>
  )
}
