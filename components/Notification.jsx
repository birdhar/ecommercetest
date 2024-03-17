import React, { useEffect } from "react";
import style from "../styles/Categories.module.css";
import AOS from "aos";
import "aos/dist/aos.css";

function Notification() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div
      className={style.notifycontainer}
      data-aos="zoom-in"
      data-aos-duration="700"
      data-aos-delay="100"
    >
      <h3
        className={style.notifyh3}
        data-aos="fade-up"
        data-aos-duration="700"
        data-aos-delay="200"
      >
        Start Shopping With Us
      </h3>
      <p
        className={style.notifyp}
        data-aos="fade-up"
        data-aos-duration="700"
        data-aos-delay="300"
      >
        Stay ahead of the curve! Get notifications and be the first to know
        about our latest products, exclusive offers, and exciting promotions
      </p>

      <div
        className="mt-8 w-[80vw] md:w-[40rem]"
        data-aos-easing="ease-in-back"
        data-aos-duration="700"
        data-aos-delay="700"
      >
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            type="search"
            className="relative m-0 -mr-0.5 block min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder="Enter Email"
            aria-label="Search"
            aria-describedby="button-addon1"
          />

          <button
            className="relative z-[2] bg-[#fff] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-semibold uppercase leading-tight text-[#415161] shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
            type="button"
            id="button-addon1"
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;
