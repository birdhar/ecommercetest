import ProfileLayout from "@/components/ProfileLayout";
import React, { useEffect, useState } from "react";
import style from "../../styles/ProfileLayout.module.css";
import axios from "axios";
import { Notfication } from "@/validation/Snackbar";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userAddress, setUserAddress] = useState({
    name: "",
    phone: "",
    address: "",
    locality: "",
    pincode: "",
  });
  const [prevAddress, setPrevAddress] = useState({});
  const [notificationState, setNotificationState] = useState({
    msg: "",
    run: false,
    status: "error",
  });

  const getUserProfile = async () => {
    try {
      const response = await axios.get(`/api/user/profile`);
      setUserAddress(response?.data?.address);
      setPrevAddress(response?.data?.address);
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);

  const hasChanged =
    JSON.stringify(userAddress) !== JSON.stringify(prevAddress);
  const saveAddress = async () => {
    if (
      userAddress?.name === "" ||
      userAddress?.phone === "" ||
      userAddress?.address === "" ||
      userAddress?.locality === "" ||
      userAddress?.pincode === ""
    ) {
      setNotificationState({
        msg: "Please fill all the fields",
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
        getUserProfile();
      }
    } catch (error) {
      setNotificationState({
        msg: "Error updating user address",
        run: true,
        status: "success",
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

  return (
    <>
      <Head>
        <title>My Profile</title>
        <meta
          name="description"
          content="Manage your account settings, view order history, track orders, and more on our profile page"
        />
        <link rel="canonical" href="/account/profile" />
      </Head>
      <ProfileLayout>
        <div className={style.profile}>
          <div className={style.profilerow}>
            <h6 className={style.profileh6}>Delivery Address</h6>
          </div>

          <div className={style.profilerow}>
            <input
              type="text"
              placeholder="Name"
              value={userAddress?.name}
              onChange={(e) =>
                setUserAddress({ ...userAddress, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Phone Number"
              value={userAddress?.phone}
              onChange={(e) =>
                setUserAddress({ ...userAddress, phone: e.target.value })
              }
            />
          </div>
          <div className={style.profilerow}>
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
              setUserAddress({ ...userAddress, address: e.target.value })
            }
          />

          {hasChanged && (
            <div className={style.checkoutbtnflex}>
              <button type="button" onClick={saveAddress}>
                Change Address
              </button>
            </div>
          )}
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
      </ProfileLayout>
    </>
  );
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: `/login?next=${"/account/profile"}`,
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

export default Profile;
