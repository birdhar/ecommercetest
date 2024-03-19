import ProfileLayout from "@/components/ProfileLayout";
import React, { useEffect, useState } from "react";
import style from "../../styles/ProfileLayout.module.css";
import axios from "axios";
import { IndianRupeeFormatter } from "@/utils/IndianRupeeFormatter";
import { CircularProgress, Skeleton } from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

function Orders() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const getOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/orders?userId=1`);
      if (response?.data?.length > 0) {
        setOrders(response?.data);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching user address:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);
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

  if (loading) {
    return (
      <>
        <Head>
          <title>Your Order History</title>
          <meta
            name="description"
            content="Track and manage your past orders with ease on our order history page"
          />
          <link rel="canonical" href="/account/orders" />
        </Head>

        <ProfileLayout>
          <div className={style.profile}>
            <div className={style.profilerow}>
              <h6 className={style.profileh6}>Your Orders</h6>
            </div>
            <div className={style.skeletonContainer}>
              {[...Array(10)]?.map((item, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  style={{
                    width: "100%",
                    height: "4rem",
                    marginBottom: "0.5rem",
                  }}
                />
              ))}
            </div>
          </div>
        </ProfileLayout>
      </>
    );
  }

  return (
    <ProfileLayout>
      <div className={style.profile}>
        <div className={style.profilerow}>
          <h6 className={style.profileh6}>Your Orders</h6>
        </div>

        {orders?.length > 0 ? (
          <div className={style.orderscontainer}>
            {orders?.map((order) => (
              <div className={style.orderr} key={order?._id}>
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
                        Ordered on{" "}
                        {new Date(order?.createdAt)?.toLocaleDateString(
                          "en-US"
                        )}
                      </p>
                    </div>
                    <div className={style.producttextflex}>
                      <p className={style.producttext}>
                        <IndianRupeeFormatter
                          amount={product?.price_data?.unit_amount}
                        />
                        <span
                          className={
                            order?.payment === "Failed"
                              ? `${style.producttextspan} ${style.failed}`
                              : order?.payment === "Pending"
                              ? `${style.producttextspan} ${style.pending}`
                              : style.producttextspan
                          }
                        >
                          {order?.payment}
                        </span>
                      </p>
                      <p className={style.producttext}>
                        {product?.quantity}{" "}
                        {product?.quantity > 1 ? "Items" : "Item"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className={style.nodata}>
            <p className={style.nodatap}>No order found</p>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: `/login?next=${"/account/orders"}`,
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

export default Orders;
