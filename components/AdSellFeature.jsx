import React, { useEffect } from "react";
import style from "../styles/Categories.module.css";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

function AdSellFeature() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className={style.adsellcontainer}>
      <div className={style.adsell}>
        <div className={style.adselleft}>
          <h3 className={style.adselleftheading} data-aos="fade-up">
            Lowest Prices Best Quality Shopping
          </h3>
          <div className={style.deliveryfeatures} data-aos="fade-up">
            <div className={style.deliveryfeature}>
              <img src="/images/delivery.png" alt="delivery" />
              <p>Easy Delivery</p>
            </div>
            <div className={style.deliveryfeature}>
              <img src="/images/cod.png" alt="delivery" />
              <p>Cash on Delivery</p>
            </div>
            <div className={style.deliveryfeature}>
              <img src="/images/roi.png" alt="delivery" />
              <p>Easy Returns</p>
            </div>
          </div>

          <div className={style.shopbtncontainer} data-aos="fade-up">
            <Link type="button" className={style.shopbtn} href={"/products"}>
              Start Shopping
            </Link>
          </div>
        </div>
        <div className={style.adselright}>
          <img
            src="/images/shopping.png"
            alt="ecommerce-shopping"
            data-aos="zoom-in"
            data-aos-easing="ease-in-sine"
            data-aos-duration="1000"
          />
        </div>
      </div>
    </div>
  );
}

export default AdSellFeature;
