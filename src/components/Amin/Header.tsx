import Link from "next/link"
import React from "react"
import { signOut } from "next-auth/react"
import { Menu } from "@headlessui/react"
import { BiMenu } from "react-icons/bi"

const Header = () => {
  return (
    <div className="flex items-center gap-5 justify-between px-5 py-5 bg-black text-zinc-300">
      <Link href="/admin">
        <a className="text-3xl font-bold">Admin</a>
      </Link>

      <div className="items-center gap-5 ml-auto hidden sm:flex">
        <Link href="/admin/users">
          <a>Users</a>
        </Link>

        <Link href="/admin/ads">
          <a>Ads</a>
        </Link>

        <Link href="/admin/packages">
          <a>Packages</a>
        </Link>

        <Link href="/admin/deposits">
          <a>Deposits</a>
        </Link>

        <Link href="/admin/withdraws">
          <a>Withdraws</a>
        </Link>

        <Link href="/admin/settings">
          <a>Settings</a>
        </Link>
      </div>
      <Menu as="div" className="ml-auto sm:hidden relative">
        <Menu.Button>
          <BiMenu className="text-2xl" />
        </Menu.Button>
        <Menu.Items className="flex flex-col absolute top-7 rounded-md right-0 w-52 bg-zinc-600 text-white">
          <Menu.Item as="div">
            <Link href="/admin/users">
              <a className="px-5 py-2 block">Users</a>
            </Link>
          </Menu.Item>

          <Menu.Item as="div">
            <Link href="/admin/ads">
              <a className="px-5 py-2 block">Ads</a>
            </Link>
          </Menu.Item>

          <Menu.Item as="div">
            <Link href="/admin/packages">
              <a className="px-5 py-2 block">Packages</a>
            </Link>
          </Menu.Item>
          <Menu.Item as="div">
            <Link href="/admin/deposits">
              <a className="px-5 py-2 block">Deposits</a>
            </Link>
          </Menu.Item>
          <Menu.Item as="div">
            <Link href="/admin/withdraws">
              <a className="px-5 py-2 block">Withdraws</a>
            </Link>
          </Menu.Item>
          <Menu.Item as="div">
            <Link href="/admin/settings">
              <a className="px-5 py-2 block">Settings</a>
            </Link>
          </Menu.Item>
        </Menu.Items>
      </Menu>

      <button className="text-red-500" onClick={() => signOut()}>
        Logout
      </button>
    </div>
  )
}

export default Header
