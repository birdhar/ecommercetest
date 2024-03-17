import style from "../styles/Herosection.module.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Link from "next/link";

function HeroSection() {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const carousalItems = [
    {
      text1: "Best Deals",
      text2: "One Click Away",
      img: "https://shopsy-tcj.netlify.app/assets/shopping-vpNvhQDE.png",
    },
    {
      text1: "Explore, Shop",
      text2: "Your Destination",
      img: "https://shopsy-tcj.netlify.app/assets/women-NhG2D3pl.png",
    },
  ];
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <Carousel
        swipeable={false}
        draggable={false}
        // showDots={true}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={2000}
        slidesToSlide={1}
        keyBoardControl={true}
        arrows={false}
        containerclassName="carousel-container"
        dotListclassName="custom-dot-list-style"
        itemclassName="carousel-item-padding-40-px"
      >
        {carousalItems?.map((item, index) => (
          <div className={style.herosection} key={index}>
            <div
              className={style.herotextcontainer}
              data-aos="zoom-out"
              data-aos-delay="100"
            >
              <h2 className={style.herotext}>{item?.text1}</h2>
              <h2 className={style.herotext}>{item?.text2}</h2>
              <Link href={"/products"} className={style.orderbtn}>
                Order Now
              </Link>
            </div>

            <div
              className={style.heroimagecontainer}
              data-aos="zoom-in"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              <img className={style.heroimage} src={item?.img} />
            </div>
          </div>
        ))}
      </Carousel>
    </>
  );
}

export default HeroSection;
