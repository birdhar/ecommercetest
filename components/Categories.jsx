import React, { useEffect, useState } from "react";
import style from "../styles/Categories.module.css";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/router";

function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
    AOS.init();
  }, []);
  const filteredCategories = categories?.filter((cat) => {
    return cat?.parent === null;
  });

  const handleClickRoute = (url) => {
    router.push(url);
  };

  return (
    <div className={style.categories}>
      <h3 className={style.categoriesheading} data-aos="fade-up">
        Categories
      </h3>
      <p className={style.categoriespara} data-aos="fade-up">
        Explore our Array of Categories, Where Every Desire Finds Its Perfect
        Match!
      </p>

      <div className={style.categorylist}>
        {filteredCategories?.map((category) => (
          <div
            key={category?._id}
            className={style.category}
            data-aos="fade-left"
            onClick={() => handleClickRoute(`/category/${category?.name}`)}
          >
            <div className={style.categoryimg}>
              <img src={category?.image} alt="" />
            </div>
            {category?.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
