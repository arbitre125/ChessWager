import { useCollectionData } from "react-firebase-hooks/firestore"
import { FirebaseError } from "firebase/app"
import firebase from "firebase/compat/app"
import { UserListItem } from "./UserListItem"
import { User } from "../../../../interfaces/User"

const firestore = firebase.firestore()

interface Props {
  search: string
}

export const UsersList: React.FC<Props> = ({ search }) => {
  const usersCollectionRef = firestore.collection("users")
  const query = usersCollectionRef
    .where("searchableDisplayName", ">=", search.toLowerCase()) //@todo tolowercase
    .where("searchableDisplayName", "<=", search.toLowerCase() + "\uf8ff")

  const [users]: [User[] | undefined, boolean, FirebaseError | undefined] =
    useCollectionData(query, { idField: "id" })

  return (
    <div className="h-60 w-full overflow-y-auto overflow-x-hidden">
      {users?.map((user) => (
        <UserListItem key={user.id} {...user} />
      ))}
    </div>
  )
}
