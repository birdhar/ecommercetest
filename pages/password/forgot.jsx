import { Notfication } from "@/validation/Snackbar";
import axios from "axios";
import Head from "next/head";
import React, { useState } from "react";

function ResetPassword() {
  const [email, setEmail] = useState();
  const [loading, setLoging] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [notificationState, setNotificationState] = useState({
    msg: "",
    run: false,
    status: "error",
  });
  const handleSubmit = async (e) => {
    setLoging(true);
    e.preventDefault();
    await axios
      .post("/api/auth/forgotpass", { email })
      .then((res) => {
        if (res.status === 200) {
          setNotificationState({
            msg: res.data,
            run: true,
            status: "success",
          });
          setMailSent(true);
        }

        setLoging(false);
      })
      .catch((err) => {
        setNotificationState({
          msg: err?.response?.data?.message,
          run: true,
          status: "error",
        });

        setLoging(false);
      });
  };

  if (mailSent) {
    return (
      <>
        <Head>
          <title>
            <title>
              Shop the Latest Trends in Fashion, Electronics, Appliances and...
              | EMart
            </title>
          </title>
          <meta
            name="description"
            content="Discover the latest fashion trends and shop a wide selection of clothing, accessories, and footwear at EMart."
          />
          <link rel="canonical" href="/password/forgot" />
        </Head>

        <section className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center h-[80vh]">
          <div className="border shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col items-center justify-center p-4">
            <img src="/images/emaill.png" alt="recovery email" />
            <h6 className="text-[1rem] text-[#415161] mt-4">
              Verify your email address
            </h6>
            <p className="text-[0.9rem] text-[#353c42] mt-2">
              {" "}
              Please click on the link in the email we just sent
            </p>

            <button
              className="border text-[#353c42] p-2 text-[0.75rem] mt-2 rounded bg-[#f6f4f4]"
              type="button"
              onClick={handleSubmit}
            >
              Resend Email
            </button>
          </div>
        </section>
      </>
    );
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-8 h-8 mr-2"
            src="/images/logo-blue.png"
            alt="logo"
          />
          EMart
        </div>
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot Password?
          </h2>

          <form
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                for="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>

            <button
              type="submit"
              disabled={loading ? true : false}
              className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {loading ? "Processing..." : "Send"}
            </button>
          </form>
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
    </section>
  );
}

export default ResetPassword;
