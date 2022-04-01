interface Props {
    name: string
    icon: React.ReactNode
    data: string
  }
  
  export const WideDataTile: React.FC<Props> = ({ name, icon, data }) => {
    return (
      <div
        title={name}
        className="flex w-full rounded-md bg-stone-300 dark:bg-stone-600"
      >
        <div className="flex justify-center items-center rounded-md text-lg m-1 px-6 bg-stone-100 dark:bg-stone-700">
          {icon}
        </div>
        <div className="flex justify-center items-center grow text-lg">
          {data}
        </div>
      </div>
    )
  }
  