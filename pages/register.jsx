import axios from "axios";
import React, { useEffect, useState } from "react";
import { Notfication } from "@/validation/Snackbar";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [useerdata, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [notificationState, setNotificationState] = useState({
    msg: "",
    run: false,
    status: "error",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(useerdata));
    setIsSubmit(true);
  };
  useEffect(() => {
    if (Object?.keys(errors)?.length === 0 && isSubmit) {
      handleCreateUser();
    }
  }, [errors]);
  const validate = (values) => {
    const errrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.name) {
      errrors.name = "Name Required";
    }
    if (!values.email) {
      errrors.email = "Email Required";
    }
    if (!emailRegex.test(useerdata?.email)) {
      errrors.email = "Incorrect email format";
    }

    if (!values.password) {
      errrors.password = "Password Required";
    }
    return errrors;
  };

  const handleCreateUser = async () => {
    setLoading(true);
    const res = await axios.post("/api/register", {
      name: useerdata.name,
      password: useerdata.password,
      email: useerdata.email,
    });

    if (res.data === "user already exists") {
      setLoading(false);
      setNotificationState({
        msg: res.data,
        run: true,
        status: "error",
      });
    }
    if (res.data === "user created") {
      setNotificationState({
        msg: res.data,
        run: true,
        status: "success",
      });

      router.push("/login");
      setLoading(false);
    }
  };

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
        <link rel="canonical" href="/register" />
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
                Create and account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    for="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={useerdata.name}
                    onChange={(e) =>
                      setUserData({ ...useerdata, name: e.target.value })
                    }
                    id="name"
                    placeholder="FirstName LastName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                  <p className="text-[#e96868] text-[0.75rem]">
                    {errors?.name}
                  </p>
                </div>
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
                    value={useerdata.email}
                    onChange={(e) =>
                      setUserData({ ...useerdata, email: e.target.value })
                    }
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                  <p className="text-[#e96868] text-[0.75rem]">
                    {errors?.email}
                  </p>
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
                    value={useerdata.password}
                    onChange={(e) =>
                      setUserData({ ...useerdata, password: e.target.value })
                    }
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                  <p className="text-[#e96868] text-[0.75rem]">
                    {errors?.password}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading ? true : false}
                  className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {loading ? "Please wait.." : "Create an account"}
                </button>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
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

export default Register;
