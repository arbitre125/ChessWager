import { DropdownState } from "../../../containers/DropdownState"

interface Props {
  text?: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  goToMenu?: string
  url?: string
  onClick?: () => void
  isBackButton?: boolean
}

export const DropdownItem: React.FC<Props> = ({
  text,
  leftIcon,
  rightIcon,
  goToMenu,
  url,
  onClick,
  isBackButton,
}) => {
  const { setActiveMenu, menuStack, setMenuStack } =
    DropdownState.useContainer()
  const address = url ?? "#"
  const backStyle = isBackButton ? "h-10" : "h-12"
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href={address}
      target={url ? "_blank" : ""}
      rel="noreferrer"
      className={`w-64 px-4 flex items-center hover:bg-stone-300 dark:hover:bg-stone-600 dark:text-stone-200 text-stone-900 dark:hover:text-stone-200 color-shift ${backStyle}`}
      onClick={() => {
        onClick && onClick()
        goToMenu && setActiveMenu(goToMenu)
        goToMenu && setMenuStack([...menuStack, goToMenu])
        isBackButton && setActiveMenu(menuStack[menuStack.length - 2])
        isBackButton && setMenuStack(menuStack.slice(0, -1))
      }}
    >
      <div className="w-full flex gap-3">
        <div className="flex flex-col justify-center">{leftIcon}</div>
        <p className="flex flex-col justify-center">{text}</p>
      </div>
      <div className="flex flex-col justify-center">{rightIcon}</div>
    </a>
  )
}
