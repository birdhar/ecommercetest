import Layout from "@/components/Layout";
import style from "../../styles/Products.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { IndianRupeeFormatter } from "@/utils/IndianRupeeFormatter";
import { getSession, useSession } from "next-auth/react";
import { pincodes } from "@/constatns/constatnt";
import { Notfication } from "@/validation/Snackbar";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { addProductToCart } from "@/redux/cartSlice";
import Head from "next/head";
import { CircularProgress } from "@mui/material";

function ProductDetails() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const regex = /^[0-9]+$/;
  const dispatch = useDispatch();
  const { items } = useSelector((store) => store.cart);
  const [pincode, setPincode] = useState("");
  const [showFullText, setShowFullText] = useState(false);
  const id = router?.query?.productdetails?.[0];
  const [product, setProduct] = useState({});
  const [count, setCount] = useState(0);
  const toggleText = () => {
    setShowFullText(!showFullText);
  };
  const [notificationState, setNotificationState] = useState({
    msg: "",
    run: false,
    status: "error",
  });
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((res) => {
      setProduct(res.data);
    });
  }, [id]);
  const handleCheckPincode = () => {
    const isDeliveryAvailable = pincodes.includes(pincode);
    setNotificationState({
      msg: isDeliveryAvailable
        ? "Delivery available"
        : "Sorry! Delivery not available",
      run: true,
      status: isDeliveryAvailable ? "success" : "error",
    });
  };
  const productInCart = items?.filter((item) => {
    return item?.info?._id === product?._id;
  });
  const handleAddProduct = () => {
    if (productInCart?.length > 0) {
      router.push("/cart");
    } else {
      dispatch(addProductToCart({ info: product, count: 1 }));
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

  return (
    <>
      <Head>
        <title>{product?.name}</title>
        <meta
          name="description"
          content={`${product?.description?.slice(0, 150)}`}
        />
      </Head>

      <Layout>
        <div className={style.productDetailscontainer}>
          <div className={style.productDetails}>
            <div className={style.productDetailsimgcontainer}>
              <img
                className={style.productDetailsimg}
                src={product?.image}
                alt={product?.name}
              />
            </div>
            <div className={style.productDetailstextcontainer}>
              <h2 className={style.productheading}>{product?.name}</h2>
              <p className={style.productpara}>
                {" "}
                {product?.description?.length <= 150 ? (
                  product?.description
                ) : showFullText ? (
                  <>
                    {product?.description}{" "}
                    <span
                      className="cursor-pointer text-[#59595a] font-semibold text-[0.8rem]"
                      onClick={toggleText}
                    >
                      Show Less
                    </span>
                  </>
                ) : (
                  <>
                    {product?.description?.slice(0, 150)}{" "}
                    <span
                      className="cursor-pointer text-[#414142] font-semibold text-[0.8rem]"
                      onClick={toggleText}
                    >
                      ...Show More
                    </span>
                  </>
                )}
              </p>
              <div className={style.productrating}>
                {[...Array(5)]?.map((item, index) => {
                  const givenRating = index + 1;
                  return (
                    <>
                      {givenRating <= product?.rating ? (
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
                <IndianRupeeFormatter amount={product?.price} />
              </h5>

              {/* <div className={style.countflex}>
              <div className={style.countcontainer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={style.countcont}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>

                <p className={style.countcont}>{count}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={style.countcont}
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className={style.availtext}>
                Only <span>12</span> items available! Don't miss it
              </p>
            </div> */}

              <div className={style.btnflex}>
                <button
                  className={`${style.btn} ${style.btnfill}`}
                  onClick={handleAddProduct}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  {productInCart?.length > 0 ? "Go to Cart" : "Add to Cart"}
                </button>
                <button className={`${style.btn} ${style.btnoutline}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  WishList
                </button>
              </div>

              <div className={style.productfeatures}>
                <h5 className={style.productfeaturesh5}>Product Features</h5>

                <ul className={style.productfeaturesul}>
                  {product?.features &&
                    Object?.entries(product?.features)?.map(([key, value]) => (
                      <li className={style.productfeaturesli} key={key}>
                        <p>{key} : </p>
                        <span className={style.productfeatureslispan}>
                          {value}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className={style.deliverystatus}>
                <h5 className={style.productfeaturesh5}>
                  {" "}
                  Check Delivery Status
                </h5>
                <form className={style.deliveryform}>
                  <input
                    className={style.deliveryinput}
                    type="text"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <button
                    type="button"
                    disabled={
                      regex.test(pincode) && pincode.length === 6 ? false : true
                    }
                    className={
                      regex.test(pincode) && pincode.length === 6
                        ? `${style.deliverybtn} ${style.deliverybtnActive}`
                        : style.deliverybtn
                    }
                    onClick={handleCheckPincode}
                  >
                    Check
                  </button>
                </form>
              </div>
            </div>
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
        </div>
      </Layout>
    </>
  );
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   const { url } = req;

//   if (!session) {
//     return {
//       redirect: {
//         destination: `/login?next=${url}`,
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

export default ProductDetails;
