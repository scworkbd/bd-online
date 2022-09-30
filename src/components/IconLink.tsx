import Link from "next/link"
import { useRouter } from "next/router"
import { IconType } from "react-icons/lib"

type Props = {
  icon: IconType
  href: string
  text: string
}

const IconLink = (props: Props) => {
  const router = useRouter()
  const Icon = props.icon
  const active = router.asPath === props.href

  return (
    <Link href={props.href}>
      <a
        className={`text-zinc-300 flex items-center gap-2 text-lg px-5 py-2 ${
          active && "bg-zinc-800"
        }`}
      >
        <Icon />
        <span>{props.text}</span>
      </a>
    </Link>
  )
}

export default IconLink
