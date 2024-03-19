import Link from "next/link";
import React, { useEffect, useState } from "react";
import Drawer from "./Drawer";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCartTotal } from "@/redux/cartSlice";
function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const { totalQuantity, items } = useSelector((store) => store.cart);

  const [notificationState, setNotificationState] = useState({
    msg: "",
    run: false,
    status: "error",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");

      setCategories(res.data);
    } catch (error) {
      setNotificationState({
        msg: error?.response?.data?.error ?? "Unauthorized access",
        run: true,
        status: "error",
      });
    }
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      const filtered = categories?.filter((item) =>
        item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setFilteredItems(filtered);
    }, 1000);

    return () => clearTimeout(delay);
  }, [searchQuery, categories]);
  const handleClickRoute = (url) => {
    router.push(url);
  };

  useEffect(() => {
    dispatch(getCartTotal());
  }, [items]);

  return (
    <>
      <header className="bg-[#ffffff] sticky z-10 shadow-[0 4px 12px 0 rgba(0,0,0,.05)] border-b border-gray-100 top-0 p-4 px-4 flex items-center justify-between w-full sm:px-8">
        <Link href="/" className="flex  items-start gap-2 ">
          <img src="/images/logo-blue.png" alt="" className="w-8 h-8" />
          <p className="text-[#f16868] text-[1.53rem] font-semibold">EMart</p>
        </Link>

        <div className="flex gap-10">
          <ul className="mt-1 hidden gap-10 lg:flex">
            <li className="">
              <Link
                href="/"
                className={
                  router?.pathname === "/"
                    ? "text-[#415161] text-[0.9rem] font-normal" +
                      " " +
                      "text-[#f2295b]"
                    : "text-[#415161] text-[0.9rem] font-normal"
                }
              >
                HOME
              </Link>
            </li>
            <li className="">
              <Link
                href="/products"
                className={
                  router?.pathname === "/products"
                    ? "text-[#415161] text-[0.9rem] font-normal" +
                      " " +
                      "text-[#f2295b]"
                    : "text-[#415161] text-[0.9rem] font-normal"
                }
              >
                ALL PRODUCTS
              </Link>
            </li>

            <li className="">
              <Link
                href="/account/profile"
                className={
                  router?.pathname?.split("/")?.[1] === "account"
                    ? "text-[#415161] text-[0.9rem] font-normal" +
                      " " +
                      "text-[#f2295b]"
                    : "text-[#415161] text-[0.9rem] font-normal"
                }
              >
                ACCOUNT
              </Link>
            </li>
          </ul>

          <div className="w-[15rem] hidden relative sm:block">
            <div className="w-full absolute">
              <input
                value={searchQuery}
                onChange={(e) => {
                  setFilteredItems([]);
                  setSearchQuery(e.target.value);
                }}
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-[0.8rem] font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                id="exampleSearch"
                placeholder="Search..."
              />
            </div>
            {searchQuery !== "" && (
              <ul className="absolute z-10 border top-[2rem] w-full max-h-[70vh] overflow-y-scroll">
                {filteredItems?.map((cat) => (
                  <li
                    key={cat?._id}
                    className="border-b p-2 text-neutral-700 cursor-pointer text-[0.8rem] bg-white"
                    onClick={() => handleClickRoute(`/category/${cat?.name}`)}
                  >
                    {cat?.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href="/cart"
            className={
              "text-[#415161] text-[0.9rem] font-normal hidden sm:block"
            }
          >
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-[#f16868]"
                // f2295b
              >
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
              </svg>

              <div className="absolute top-[-0.9rem] right-[-0.9rem] bg-[#f16868] text-[#fff] h-[1.3rem] w-[1.3rem] rounded-full text-[0.7rem] grid place-items-center">
                {totalQuantity}
              </div>
            </div>
          </Link>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-[#415161] cursor-pointer block lg:hidden"
            onClick={() => setOpenDrawer(true)}
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </header>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </>
  );
}

export default Header;
