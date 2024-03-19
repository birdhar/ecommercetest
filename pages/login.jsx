import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Notfication } from "@/validation/Snackbar";
import Head from "next/head";

function Login() {
  const router = useRouter();
  const { next } = router.query;
  const { data: session, status } = useSession();
  const [notificationState, setNotificationState] = useState({
    msg: "",
    run: false,
    status: "error",
  });
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: loginData.email,
      password: loginData.password,
      redirect: false,
      callbackUrl: "/",
    });
    if (res.ok) {
      const redirectTo = router?.asPath?.split("=")?.[1];
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }

      setLoading(false);
    } else {
      setNotificationState({
        msg: res.error,
        run: true,
        status: "error",
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const redirectTo = router?.asPath?.split("=")?.[1];
    if (redirectTo) {
      await signIn("google", { callbackUrl: redirectTo });
    } else {
      await signIn("google", { callbackUrl: "/" });
    }
  };

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (session) {
      const redirectTo = router?.asPath?.split("=")?.[1];
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

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
        <link rel="canonical" href="/login" />
      </Head>

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
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    for="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div></div>
                  <Link
                    href="/password/forgot"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-gray-400 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {loading ? "Signing in.." : "Sign in"}
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full text-black bg-white border flex gap-2 justify-center items-center hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <img
                    src="/images/google-icon.png"
                    className="h-6 w-6"
                    alt=""
                  />
                  {loading ? "Signing in.." : "Sign in with Google"}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </Link>
                </p>
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
      </section>
    </>
  );
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   if (session) {
//     return {
//       redirect: {
//         destination: `/`,
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

export default Login;
