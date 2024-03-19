import React from "react";
import style from "../styles/ProfileLayout.module.css";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleSignOut = () => {
    signOut();
    localStorage.clear();
    router.push("/login?next=/");
  };
  return (
    <div className={style.sidebar}>
      <div className={style.sidebartop}>
        <img
          className={style.avatar}
          src={session?.user?.image ?? "/images/avatar.png"}
          alt={session?.user?.image?.name}
        />
        <h6 className={style.username}>{session?.user?.name}</h6>
      </div>

      <div className={style.sidebaritems}>
        <div>
          <Link
            href="/account/profile"
            className={
              router.pathname === "/account/profile"
                ? `${style.sidebaritem} ${style.sidebaritemActive}`
                : style.sidebaritem
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
            Profile
          </Link>
          <Link
            href="/account/orders"
            className={
              router.pathname === "/account/orders"
                ? `${style.sidebaritem} ${style.sidebaritemActive}`
                : style.sidebaritem
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z"
                clipRule="evenodd"
              />
            </svg>
            Orders
          </Link>
        </div>
        <div className={style.logout} onClick={handleSignOut}>
          Logout
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
