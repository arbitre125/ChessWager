import "../../style/scrollbar.scss"
import { ChatMessage } from "./ChatMessage"
import type { Message } from "../../interfaces/Message"
import { UserDataState } from "../containers/UserDataState"
import { GlobalChatState } from "../containers/GlobalChatState"

interface Props {}

export const ChatBody: React.FC<Props> = ({}) => {
  const { userData } = UserDataState.useContainer()
  const { messages } = GlobalChatState.useContainer()
  return (
    <div
      className="scrollbar flex flex-col-reverse overflow-y-auto overflow-x-hidden px-1 pb-3"
      id="global-chat-body"
    >
      {messages
        ?.filter((message) => {
          if (userData) return !userData.blockedUsers.includes(message.uid)
          return true
        })
        .sort(
          (a: Message, b: Message) =>
            b.createdAt?.seconds - a.createdAt?.seconds,
        )
        .map((message: Message, index: number) => (
          <ChatMessage
            key={message.uid + message?.createdAt + index}
            {...message}
          />
        ))}
    </div>
  )
}
