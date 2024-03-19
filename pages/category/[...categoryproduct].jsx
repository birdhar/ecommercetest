import Layout from "@/components/Layout";
import { Notfication } from "@/validation/Snackbar";
import axios from "axios";
import { useRouter } from "next/router";
import style from "../../styles/Products.module.css";
import React, { useEffect, useState } from "react";
import { IndianRupeeFormatter } from "@/utils/IndianRupeeFormatter";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";

function Categoryproduct() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const cat = router?.query?.categoryproduct?.[0];
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [notificationState, setNotificationState] = useState({
    msg: "",
    run: false,
    status: "error",
  });
  useEffect(() => {
    fetchCategories();
    fetchProcucts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");

      setCategories(res.data);
    } catch (error) {
      setNotificationState({
        msg: error?.response?.data?.error ?? "Unauthorized access",
        run: true,
        status: "error",
      });
    }
  };
  const fetchProcucts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (error) {
      setNotificationState({
        msg: error?.response?.data?.error ?? "Unauthorized access",
        run: true,
        status: "error",
      });
    }
  };

  // const getFilteredProducts = (targetCategory) => {
  //   const productss = products?.filter((p) => {
  //     return p?.category === targetCategory?._id;
  //   });
  //   return productss

  // }

  useEffect(() => {
    setFilteredItems([]);
    let targetCategoryArr = [];
    let targetCategory = categories?.find(
      (c) => c?.name?.toLowerCase() === cat?.toLowerCase()
    );

    const filteredProducts = products?.filter((p) => {
      return p?.category === targetCategory?._id;
    });

    if (filteredProducts?.length > 0) {
      setFilteredItems(filteredProducts);
    } else {
      let arr1 = categories?.filter(
        (c) => c?.parent?._id === targetCategory?._id
      );

      targetCategoryArr = arr1;
      while (arr1?.length > 0) {
        let arr2 = [];
        arr1?.map((item) => {
          const filterArr = categories?.filter(
            (c) => c?.parent?._id === item?._id
          );
          arr2.push(...filterArr);
        });

        arr1 = arr2;
        if (arr2?.length > 0) {
          targetCategoryArr = arr2;
        }
        arr2 = [];
      }

      targetCategoryArr?.map((categoryy) => {
        const filteredProds = products?.filter((p) => {
          return p?.category === categoryy?._id;
        });

        setFilteredItems((prevItems) => [...prevItems, ...filteredProds]);
      });
    }
  }, [categories, products, router]);

  useEffect(() => {
    if (filteredItems?.length > 0 && loading) {
      setLoading(false);
    }
  }, [filteredItems, loading]);

  useEffect(() => {
    if (status === "loading") {
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
    <Layout>
      <div className={style.productscontainer}>
        <div className={style.prodtextcount}>
          <h6>
            {cat}{" "}
            <span className={style.prodtextcountspan}>
              - {filteredItems?.length}
            </span>{" "}
          </h6>
        </div>
        <div className={style.categorylist}>
          {filteredItems?.map((product) => (
            <Link
              href={`/product/${product?._id}`}
              // ref={ref}
              className={style.product}
              key={product?._id}
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
            >
              <div className={style.productimgcontainer}>
                <img
                  src={product?.image}
                  alt={product?.name}
                  className={style.productimg}
                />
              </div>
              <div className={style.producttext}>
                <h6 className={style.productname}>
                  {product?.name?.length <= 28
                    ? product?.name
                    : `${product?.name?.slice(0, 28)}...`}
                </h6>
                <div className={style.priceflex}>
                  <p className={style.productprice}>
                    <IndianRupeeFormatter amount={product?.price} />
                  </p>
                  <div className={style.rating}>
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
                              className={style.star}
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
                              className={`${style.star} ${style.staractive}`}
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
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && filteredItems?.length === 0 && (
          <div className={style.noproduct}>
            <img src="/images/noproduct.png" alt="products" />
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
    </Layout>
  );
}

export default Categoryproduct;
