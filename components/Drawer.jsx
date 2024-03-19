import * as React from "react";
import { signOut } from "next-auth/react";
import style from "../styles/Drawer.module.css";
import { Drawer } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar({ open, onClose }) {
  const anchor = "right";
  const router = useRouter();
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    onClose();
  };

  const handleSignOut = () => {
    signOut();
    localStorage.clear();
    router.push("/login?next=/");
  };

  const list = (anchor) => (
    <>
      <div className={style.drawer}>
        <div>
          <div className={style.drawerheader}>
            <Link href={"/"} className="flex  items-start gap-1 ">
              <img src="/images/logo-blue.png" alt="" className="w-6 h-6" />
              <p className="text-[#f16868] text-[1.2rem] font-semibold">
                EMart
              </p>
            </Link>

            <Link
              href="/"
              className={
                "text-[#415161] text-[0.9rem] font-normal mt-[0.5rem] mr-[0.5rem]"
              }
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[1.1rem] h-[1.1rem] text-[#f16868]"
                >
                  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                </svg>

                <div className="absolute top-[-0.7rem] right-[-0.9rem] bg-[#f16868] text-[#fff] h-[1.1rem] w-[1.1rem] rounded-full text-[0.7rem] grid place-items-center">
                  0
                </div>
              </div>
            </Link>
          </div>
          <div className={style.searchbar}>
            <input
              type="search"
              className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-[0.8rem] font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
              id="exampleSearch"
              placeholder="Search..."
            />
          </div>
          <ul className={style.drawerlist}>
            <li className={style.listitem}>
              <Link
                href="/"
                className={
                  router.pathname === "/"
                    ? `${style.listitemanchor} ${style.listitemanchorActive}`
                    : style.listitemanchor
                }
              >
                HOME
              </Link>
            </li>
            <li className={style.listitem}>
              <Link
                href="/products"
                className={
                  router.pathname === "/products"
                    ? `${style.listitemanchor} ${style.listitemanchorActive}`
                    : style.listitemanchor
                }
              >
                ALL PRODUCTS
              </Link>
            </li>

            <li className={style.listitem}>
              <Link
                href="/account/profile"
                className={
                  router?.pathname?.split("/")?.[1] === "account"
                    ? `${style.listitemanchor} ${style.listitemanchorActive}`
                    : style.listitemanchor
                }
              >
                ACCOUNT
              </Link>
            </li>
          </ul>
        </div>

        <div className={style.logout} onClick={handleSignOut}>
          Logout
        </div>
      </div>
    </>
  );

  return (
    <>
      <Drawer anchor={anchor} open={open} onClose={toggleDrawer(anchor, false)}>
        {list(anchor)}
      </Drawer>
    </>
  );
}
