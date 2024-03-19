import Layout from "@/components/Layout";
import { Notfication } from "@/validation/Snackbar";
import style from "../styles/Checkout.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IndianRupeeFormatter } from "@/utils/IndianRupeeFormatter";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { CircularProgress } from "@mui/material";

function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState({});
  const [notificationState, setNotificationState] = useState({
    msg: "",
    run: false,
    status: "error",
  });
  useEffect(() => {
    if (!router?.query?.orderId) {
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/orders?id=" + router?.query?.orderId);

        setOrder(res.data);
      } catch (error) {
        setNotificationState({
          msg: "Something went wrong",
          run: true,
          status: "error",
        });
      }
    };
    const updateOrder = async (status) => {
      const response = await axios.patch(
        "/api/orders?id=" + router?.query?.orderId,
        {
          payment: status,
        }
      );
    };
    fetchData();

    if (router?.query?.success === "1") {
      dispatch(clearCart());
      updateOrder("Paid");
    }
    if (router?.query?.fail === "1") {
      updateOrder("Failed");
    }
  }, [router?.query]);

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

  if (router?.query?.fail === "1") {
    return (
      <div className={style.orderresponse}>
        <div className={style.ordermsgflex}>
          <div className={style.orderimgflex}>
            <img src="/images/gift.png" alt="order" />
            <div>
              <h5 className={style.successbtn}> Sorry!</h5>
              <h6>Your orer has not been placed</h6>
            </div>
          </div>
          <Link href="/" className={style.gotorderbtn}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Shop the Latest Trends in Fashion, Electronics, Appliances and... |
          EMart
        </title>
        <meta
          name="description"
          content="Discover the latest fashion trends and shop a wide selection of clothing, accessories, and footwear at EMart."
        />
      </Head>

      <Layout>
        <div className={style.orderresponse}>
          <div className={style.ordermsgflex}>
            <div className={style.orderimgflex}>
              <img src="/images/gift.png" alt="order" />
              <div>
                <h5 className={style.successbtn}> Success!</h5>
                <h6>Your orer has been placed</h6>
              </div>
            </div>
            <Link href="/account/orders" className={style.gotorderbtn}>
              Go to Orders
            </Link>
          </div>
          <div className={style.ordermsgflex} style={{ marginTop: "1rem" }}>
            <div className={style.addressdiv}>
              <h6>Name</h6>
              <p>{order?.name}</p>
            </div>

            <div className={style.addressdiv}>
              <h6>Address</h6>
              <p>
                {order?.city} {order?.streetAddress}
              </p>
            </div>
            <div className={style.addressdiv}>
              <h6>Contact</h6>
              <p>{order?.phone}</p>
              <p style={{ marginTop: "0.2rem" }}>{order?.email}</p>
            </div>
          </div>
          <div className={style.orderdata} style={{ marginTop: "1rem" }}>
            {order?.product_info?.map((product, index) => (
              <div className={style.orderdataflex} key={index}>
                <img
                  src={product?.price_data?.product_data?.image}
                  alt={product?.price_data?.product_data?.name}
                />

                <div>
                  <p
                    className={style.producttext}
                    style={{ fontWeight: "600" }}
                  >
                    {product?.price_data?.product_data?.name}
                  </p>
                  <p className={style.producttext}>
                    {product?.price_data?.product_data?.description?.slice(
                      0,
                      50
                    )}
                    ...
                  </p>
                </div>
                <div className={style.productpriceflex}>
                  <p className={style.producttext}>
                    <IndianRupeeFormatter
                      amount={product?.price_data?.unit_amount}
                    />
                  </p>
                  <p className={style.producttext}>
                    {product?.quantity}{" "}
                    {product?.quantity > 1 ? "Items" : "Item"}
                  </p>
                </div>
              </div>
            ))}
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
      </Layout>
    </>
  );
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: `/login?next=${"/orderresponse"}`,
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

export default Checkout;
