import "../../../../style/dropdown.scss"
import { Auth } from "../../../containers/Auth"

import { DropdownItem } from "../DropdownItem"
import { CSSTransition } from "react-transition-group"
import Toggle from "react-toggle"

import { StaticDropdownItem } from "../StaticDropdownItem"
import { CgProfile } from "react-icons/cg"
import {
  RiLoginCircleLine,
  RiLogoutCircleLine,
  RiSettings5Line,
} from "react-icons/ri"
import { BsShare } from "react-icons/bs"
import { BiHelpCircle } from "react-icons/bi"
import { MdAttachMoney, MdMoneyOff, MdOutlineDarkMode } from "react-icons/md"
import { BsSun } from "react-icons/bs"
import { GoGift } from "react-icons/go"

interface Props {
  activeMenu: string
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>
  setMenuHeight: React.Dispatch<React.SetStateAction<number>>
  setIsDarkOn: React.Dispatch<React.SetStateAction<boolean>>
  isDarkOn: boolean
  heightMultiplier: number
  dropdownRef: any
}

export const Main: React.FC<Props> = ({
  activeMenu,
  setActiveMenu,
  setMenuHeight,
  setIsDarkOn,
  isDarkOn,
  heightMultiplier,
  dropdownRef,
}) => {
  // const userDocumentRef = firebase.firestore().collection("users")
  const {
    user,
    signOutWithGoogle,
    signInWithGoogle,
    connectWallet,
    isWalletConnecting,
    isWalletConnected,
    disconnectWallet,
  } = Auth.useContainer()
  // const userRef = userDocumentRef.doc(user?.uid)

  const updateUserDarkPref = (isChecked: boolean) => {
    // if (user?.uid) {
    //   userRef.update({
    //     darkMode: isChecked,
    //   })
    // }
    localStorage.setItem("darkMode", isChecked.toString())
  }

  const calcHeight = (el: any) => {
    const height = el.offsetHeight * heightMultiplier
    setMenuHeight(height)
  }
  // useEffect(() => {
  //   // const height = dropdownRef.current?.firstChild.offsetHeight
  //   setMenuHeight(
  //     dropdownRef.current?.firstChild.offsetHeight * heightMultiplier,

  //   )
  // }, [user, dropdownRef, heightMultiplier, setMenuHeight])

  return (
    <>
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          {user && (
            <DropdownItem
              leftIcon={<CgProfile />}
              goToMenu="profile"
              setActiveMenu={setActiveMenu}
            >
              Profile
            </DropdownItem>
          )}
          {user && (
            <DropdownItem
              leftIcon={<RiSettings5Line />}
              goToMenu="settings"
              setActiveMenu={setActiveMenu}
            >
              Settings
            </DropdownItem>
          )}

          {user && (
            <DropdownItem
              leftIcon={<GoGift />}
              goToMenu="store"
              setActiveMenu={setActiveMenu}
            >
              Store
            </DropdownItem>
          )}
          <DropdownItem
            leftIcon={<BsShare />}
            goToMenu="social"
            setActiveMenu={setActiveMenu}
          >
            Social
          </DropdownItem>
          <DropdownItem
            leftIcon={<BiHelpCircle />}
            goToMenu="help"
            setActiveMenu={setActiveMenu}
          >
            Help
          </DropdownItem>
          <StaticDropdownItem
            onClick={() => {
              setIsDarkOn(!isDarkOn)
              updateUserDarkPref(!isDarkOn)
            }}
            rightIcon={
              <div className="px-2 justify-center align-middle flex h-full py-2 ">
                <Toggle
                  icons={false}
                  className="toggle pointer-events-none "
                  checked={isDarkOn}
                  readOnly
                />
              </div>
            }
            leftIcon={isDarkOn ? <MdOutlineDarkMode /> : <BsSun />}
          >
            {isDarkOn ? "Dark Mode" : "Light Mode"}
          </StaticDropdownItem>
          <div className="border-b-2" />
          {!isWalletConnected && (
            <StaticDropdownItem
              onClick={connectWallet}
              leftIcon={<MdAttachMoney />}
              // rightIcon={isWalletConnecting ?? <div className={"animate-ping"}> . </div>}
              // rightIcon={true ?? <div className="animate-ping"> test </div>}
            >
              Connect Wallet
            </StaticDropdownItem>
          )}
          {isWalletConnected && (
            <StaticDropdownItem
              onClick={disconnectWallet}
              leftIcon={<MdMoneyOff />}
              // rightIcon={true ?? <div className="animate-ping"> test </div>}
              // rightIcon={<div>{isWalletConnecting ? "." : ""}</div>}
            >
              Disconnect Wallet
            </StaticDropdownItem>
          )}

          {!user && (
            <StaticDropdownItem
              onClick={() => {
                signInWithGoogle()
              }}
              leftIcon={<RiLoginCircleLine />}
            >
              Log in
            </StaticDropdownItem>
          )}

          {user && (
            <StaticDropdownItem
              onClick={signOutWithGoogle}
              leftIcon={<RiLogoutCircleLine />}
            >
              Log out
            </StaticDropdownItem>
          )}
        </div>
      </CSSTransition>
    </>
  )
}
