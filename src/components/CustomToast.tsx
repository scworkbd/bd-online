type Props = {
  message: string
  success?: boolean
}

const CustomToast = ({ message }: Props) => {
  return (
    <div
      className="
        px-5 py-3 flex 
        items-center gap-2 bg-rose-500 text-white
      "
    >
      <p>{message}</p>
    </div>
  )
}

export default CustomToast
