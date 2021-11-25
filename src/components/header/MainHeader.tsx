import "firebase/compat/firestore"
import "firebase/compat/auth"
import "../../style/header.scss"
import { GoogleAuthButtons } from "./buttons/google/GoogleAuthButtons"
import { MetamaskAuthButtons } from "./buttons/metamask/MetamaskAuthButtons"
import { SiLichess } from "react-icons/si"
import { IconContext } from "react-icons"
import Toggle from "react-toggle"
import "react-toggle/style.css"
import firebase from "firebase/compat"
import { Auth } from "../containers/Auth"
import { Dropdown } from "./dropdown/Dropdown"
import { NavItem } from "./dropdown/NavItem"
import { Menu } from "./dropdown/Menu"
import { DropdownItem } from "./dropdown/DropdownItem"

interface Props {
  isDarkOn: boolean
  setIsDarkOn: React.Dispatch<React.SetStateAction<boolean>>
}

export const MainHeader: React.FC<Props> = ({ isDarkOn, setIsDarkOn }) => {
  const { user } = Auth.useContainer()

  const userDocumentRef = firebase.firestore().collection("users")

  const updateUserDarkPref = (isChecked: boolean) => {
    if (user?.uid) {
      const userRef = userDocumentRef.doc(user!.uid)
      userRef.update({
        darkMode: isChecked,
      })
    }
    localStorage.setItem("darkMode", isChecked.toString())
  }

  return (
    <div className="grid grid-flow-col max-h-5">
      <div className="">
        {process.env.REACT_APP_CONTRACT_ADDRESS}
        <IconContext.Provider
          value={{
            color: "white",
            size: "3em",
            className: "global-class-name",
          }}
        >
          <SiLichess />
        </IconContext.Provider>
      </div>
      <div className="col-span-4">
        <Toggle
          onChange={(e) => {
            const isChecked = e.target.checked
            setIsDarkOn(isChecked)
            updateUserDarkPref(isChecked)
          }}
          checked={isDarkOn}
        />
      </div>
      <div className="grid grid-flow-col max-h-5">
        <MetamaskAuthButtons />
        <GoogleAuthButtons />
      </div>
      <div className="grid grid-flow-col max-h-5">
        <Dropdown>
          <NavItem msg="👑">
            <Menu>

            </Menu>
          </NavItem>
        </Dropdown>
      </div>
    </div>
  )
}
