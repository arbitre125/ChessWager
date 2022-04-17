import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore"
import { RiUserFollowLine } from "react-icons/ri"
import { firebaseApp } from "../../../../../../config"
import { Auth } from "../../../../../containers/Auth"
import { DropdownButton } from "./DropdownButton"

const db = getFirestore(firebaseApp)
interface Props {
  className?: string
  id: string
}

export const CancelPendingRequestButton: React.FC<Props> = ({
  className,
  id,
}) => {
  const { auth } = Auth.useContainer()
  const userRef = doc(db, "users", auth.currentUser!.uid)
  const targetUserRef = doc(db, "users", id)
  const requestsCollection = collection(targetUserRef, "requests")
  const cancelRequest = () => {
    deleteDoc(doc(requestsCollection, auth.currentUser!.uid))
    updateDoc(userRef, {
      redactedFriendRequests: arrayUnion(id),
    })
  }
  return (
    <DropdownButton
      className={className}
      content={<RiUserFollowLine />}
      onClick={() => {
        cancelRequest()
      }}
      title="Cancel Request"
    />
  )
}
