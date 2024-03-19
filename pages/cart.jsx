import React, { useEffect, useState } from "react";
import style from "../styles/Checkout.module.css";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { Notfication } from "@/validation/Snackbar";
import { IndianRupeeFormatter } from "@/utils/IndianRupeeFormatter";
import {
  increaseCartProduct,
  decreaseCartProduct,
  removeCartProduct,
  getCartTotal,
} from "@/redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { getSession, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import useCartItems from "@/utils/useCartItems";
import Head from "next/head";
import { CircularProgress } from "@mui/material";

function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const { items, totalQuantity, totalAmount } = useCartItems();
  const [loading, setLoading] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const id = router?.query?.pid;
  const [index, setIndex] = useState(1);
  const [tabIndex, setTabIndex] = useState(0);
  const [userAddress, setUserAddress] = useState({
    name: "",
    phone: "",
    address: "",
    locality: "",
    pincode: "",
  });
  const [notificationState, setNotificationState] = useState({
    msg: "",
    run: false,
    status: "error",
  });
  const [product, setProduct] = useState({ info: {}, count: 1 });
  const getUserAddress = async () => {
    try {
      const response = await axios.get(`/api/user/address`);
      setUserAddress(response?.data);
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };
  useEffect(() => {
    if (!id) {
      return;
    }
    const getProduct = async () => {
      try {
        const response = await axios.get("/api/products?id=" + id);
        setProduct({ ...product, info: response?.data });
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [id]);

  useEffect(() => {
    getUserAddress();
    if (window.innerWidth < 768) {
      setTabIndex(2);
    }
  }, []);

  useEffect(() => {
    dispatch(getCartTotal());
  }, [items]);

  const validateAddress = () => {
    if (
      userAddress?.name !== "" &&
      userAddress?.locality !== "" &&
      userAddress?.address !== "" &&
      userAddress?.phone?.length === 10 &&
      userAddress?.pincode?.length === 6
    ) {
      return true;
    }
    return false;
  };
  const addressValid = validateAddress();
  const saveAddress = async () => {
    if (addressValid) {
      setNotificationState({
        msg: "Please fill all the address field",
        run: true,
        status: "error",
      });
    }
    try {
      const response = await axios.post(`/api/user/address`, {
        address: userAddress,
      });

      if (response.status === 200) {
        setNotificationState({
          msg: "Address updated successfully",
          run: true,
          status: "success",
        });
        getUserAddress();
        setIndex(2);
      }
    } catch (error) {
      setNotificationState({
        msg: "Error updating user address",
        run: true,
        status: "success",
      });
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    const productInfos = items.map((product) => {
      const prod = {
        _id: product?.info?._id,
        name: product?.info?.name,
        price: product?.info?.price,
        count: product?.count,
        image: product?.info?.image,
        description: product?.info?.description,
      };
      return prod;
    });

    const res = await axios.post("/api/checkout", {
      userAddress: userAddress,
      productInfos: productInfos,
    });

    if (res.data.url) {
      setLoading(false);
      window.location = res.data.url;
    } else {
      setLoading(false);
      setNotificationState({
        msg: "Something went wrong!",
        run: true,
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (status === "loading") {
      // Session is still loading, do nothing
      return;
    }

    if (status === "unauthenticated" && !session) {
      router.push(`/login?next=${router?.asPath}`);
    }
  }, [session, status, router]);

  if (status === "loading" || (!session && status === "unauthenticated")) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#fff",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (items?.length <= 0) {
    return (
      <Layout>
        <div className={style.emptycart}>
          <img src="/images/emptycart.png" alt="" />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart | EMart</title>
        <meta
          name="description"
          content="Review and adjust your shopping cart before proceeding to checkout"
        />
        <link rel="canonical" href="/cart" />
      </Head>
      <Layout>
        <>
          {(tabIndex === 1 || tabIndex === 2) && (
            <div className={style.tabs}>
              <div
                className={
                  tabIndex === 1 ? `${style.tab} ${style.tabActive}` : style.tab
                }
                onClick={() => setTabIndex(1)}
              >
                Items
              </div>
              <div
                className={
                  tabIndex === 2 ? `${style.tab} ${style.tabActive}` : style.tab
                }
                onClick={() => setTabIndex(2)}
              >
                Price
              </div>
            </div>
          )}
          <div className={style.checkoutflex}>
            {(tabIndex === 0 || tabIndex === 1) && (
              <div className={style.checkoutsteps}>
                <div className={style.checkoutstep}>
                  <div className={style.checkoutsteptop}>
                    <div className={style.checkoutsteptopleft}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-[#415161]"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                        />
                      </svg>
                      <div className={style.delivery}>
                        <h6 className={style.deliveryheading}>
                          DELIVERY ADDRESS
                        </h6>
                      </div>
                    </div>
                    {index !== 1 && (
                      <button type="button" onClick={() => setIndex(1)}>
                        Change
                      </button>
                    )}
                  </div>
                  {index === 1 && (
                    <div className={style.checkoutstepbody}>
                      <div className={style.checkoutstepflex}>
                        <input
                          type="text"
                          placeholder="Name"
                          value={userAddress?.name}
                          onChange={(e) =>
                            setUserAddress({
                              ...userAddress,
                              name: e.target.value,
                            })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Phone Number"
                          value={userAddress?.phone}
                          onChange={(e) =>
                            setUserAddress({
                              ...userAddress,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className={style.checkoutstepflex}>
                        <input
                          type="text"
                          placeholder="Locality"
                          value={userAddress?.locality}
                          onChange={(e) =>
                            setUserAddress({
                              ...userAddress,
                              locality: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Pincode"
                          value={userAddress?.pincode}
                          onChange={(e) =>
                            setUserAddress({
                              ...userAddress,
                              pincode: e.target.value,
                            })
                          }
                        />
                      </div>
                      <input
                        className={style.checkoutinput}
                        type="text"
                        placeholder="Address"
                        value={userAddress?.address}
                        onChange={(e) =>
                          setUserAddress({
                            ...userAddress,
                            address: e.target.value,
                          })
                        }
                      />
                      <div className={style.checkoutbtnflex}>
                        {addressValid && (
                          <button type="button" onClick={saveAddress}>
                            Save and deliver here
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className={style.checkoutstep}>
                  <div className={style.checkoutsteptop}>
                    <div className={style.checkoutsteptopleft}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-[#415161]"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                        />
                      </svg>

                      <div className={style.delivery}>
                        <h6 className={style.deliveryheading}>ORDER SUMMERY</h6>
                      </div>
                    </div>
                    {index !== 2 && addressValid && (
                      <button type="button" onClick={() => setIndex(2)}>
                        Change
                      </button>
                    )}
                  </div>
                  {index === 2 && items?.length > 0 && (
                    <div className={style.checkoutstepbody}>
                      {items?.map((product) => (
                        <div
                          key={product?.info?._id}
                          className={style.productDetails}
                        >
                          <div className={style.productDetailsimgcontainer}>
                            <img
                              className={style.productDetailsimg}
                              src={product?.info?.image}
                              alt={product?.info?.name}
                            />
                          </div>
                          <div className={style.productDetailstextcontainer}>
                            <h2 className={style.productheading}>
                              {product?.info?.name}
                            </h2>

                            <p className={style.productpara}>
                              {" "}
                              {product?.info?.description?.length <= 150 ? (
                                product?.info?.description
                              ) : showFullText ? (
                                <>
                                  {product?.info?.description?.slice(0, 100)}{" "}
                                  <span
                                    className="cursor-pointer text-[#59595a] font-semibold text-[0.8rem]"
                                    onClick={() =>
                                      setShowFullText(!showFullText)
                                    }
                                  >
                                    ...Show More
                                  </span>
                                </>
                              ) : (
                                <>
                                  {product?.info?.description?.slice(0, 150)}{" "}
                                  <span
                                    className="cursor-pointer text-[#414142] font-semibold text-[0.8rem]"
                                    onClick={() =>
                                      setShowFullText(!showFullText)
                                    }
                                  >
                                    ...Show Less
                                  </span>
                                </>
                              )}
                            </p>

                            <div className={style.productrating}>
                              {[...Array(5)]?.map((item, index) => {
                                const givenRating = index + 1;
                                return (
                                  <>
                                    {givenRating <= product?.info?.rating ? (
                                      <svg
                                        key={index}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className={style.productstar}
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        key={index}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        className={`${style.star} ${style.productstaractive}`}
                                      >
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                        />
                                      </svg>
                                    )}
                                  </>
                                );
                              })}
                            </div>

                            <h5 className={style.price}>
                              <IndianRupeeFormatter
                                amount={product?.info?.price}
                              />
                            </h5>

                            <div className={style.countflex}>
                              <div className={style.countcontainer}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className={style.countcont}
                                  onClick={() =>
                                    dispatch(increaseCartProduct(product))
                                  }
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                                    clipRule="evenodd"
                                  />
                                </svg>

                                <p className={style.countcont}>
                                  {product?.count}
                                </p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className={
                                    product?.count === 1
                                      ? `${style.countcont} ${style.countcontdisabled}`
                                      : style.countcont
                                  }
                                  onClick={() =>
                                    dispatch(decreaseCartProduct(product))
                                  }
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <button
                                className={style.removebtn}
                                onClick={() =>
                                  dispatch(removeCartProduct(product))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className={style.checkoutbtnflex}>
                        {items?.length > 0 && (
                          <button type="button" onClick={() => setIndex(3)}>
                            Continue
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className={style.checkoutstep}>
                  <div className={style.checkoutsteptop}>
                    <div className={style.checkoutsteptopleft}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-[#415161]"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>

                      <div className={style.delivery}>
                        <h6 className={style.deliveryheading}>Payment</h6>
                      </div>
                    </div>
                    {/* {index !== 3 && (
               <button type="button" onClick={() => setIndex(3)}>
                 Change
               </button>
             )} */}
                  </div>

                  {index === 3 && (
                    <div className={style.checkoutstepbody}>
                      <div className={style.checkoutbtnflex}>
                        <button
                          disabled={loading ? true : false}
                          type="button"
                          onClick={handleCheckout}
                        >
                          {loading ? "Please wait..." : "Proceed to Payment"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {(tabIndex === 0 || tabIndex === 2) && (
              <div className={style.pricedetails}>
                <div className={style.pricedetailstop}>Price Details</div>
                <div className={style.pricedetailstop}>
                  <div className={style.priceitemflex}>
                    <p>
                      {totalQuantity < 2
                        ? `Price (${totalQuantity} Item)`
                        : `Price (${totalQuantity} Items)`}{" "}
                    </p>
                    <p>
                      <IndianRupeeFormatter amount={totalAmount} />
                    </p>
                  </div>
                  <div className={style.priceitemflex}>
                    <p>Delivery Charge</p>
                    <p>
                      <IndianRupeeFormatter amount={30} />
                    </p>
                  </div>
                </div>
                <div className={style.pricedetailstop}>
                  <div className={style.priceitemflex}>
                    <p>Total Payble</p>
                    <p>
                      <IndianRupeeFormatter amount={totalAmount + 30} />
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {notificationState.run && (
            <Notfication
              msg={notificationState.msg}
              run={notificationState.run}
              setRun={() =>
                setNotificationState({ msg: "", run: false, status: "error" })
              }
              postiton="bottom"
              type={notificationState.status || "error"}
            />
          )}
        </>
      </Layout>
    </>
  );
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: `/login?next=${"/cart"}`,
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {
//       session,
//     },
//   };
// }

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
