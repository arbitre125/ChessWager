import {
  doc,
  DocumentData,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { useEffect } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"
import { createContainer } from "unstated-next"
import { firebaseApp } from "../../config"
import { User } from "../../interfaces/User"
import { Auth } from "./Auth"
import { DropdownState } from "./DropdownState"

const db = getFirestore(firebaseApp)

export const useUserDataState = () => {
  const { auth } = Auth.useContainer()
  let userRef
  if (auth.currentUser?.uid) userRef = doc(db, "users", auth.currentUser?.uid)
  const [userData] = useDocumentData<User | any>(userRef) ?? []
  const { isDropdownOpen, activeMenu } = DropdownState.useContainer()

  useEffect(() => {
    if (
      auth.currentUser?.uid &&
      isDropdownOpen &&
      (activeMenu === "messages" || activeMenu === "conversation")
    ) {
      const userRef = doc(db, "users", auth.currentUser!.uid)
      updateDoc(userRef, {
        hasNewMessage: false,
      })
    }
  }, [userData?.hasNewMessage])

  useEffect(() => {
    if (
      auth.currentUser?.uid &&
      isDropdownOpen &&
      activeMenu === "notifications"
    ) {
      const userRef = doc(db, "users", auth.currentUser!.uid)
      updateDoc(userRef, {
        hasNewNotifications: false,
      })
    }
  }, [userData?.hasNewNotifications])

  return { userData }
}

export const UserDataState = createContainer(useUserDataState)
