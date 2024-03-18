import Layout from "@/components/Layout";
import { mongooseConnect } from "@/lib/mongoose";
import { getSession, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
const HeroSection = dynamic(() => import("@/components/Herosection"));
// const LatestProducts = dynamic(() => import("@/components/LatestProducts"));
// const Notification = dynamic(() => import("@/components/Notification"));
// const Categories = dynamic(() => import("@/components/Categories"));
// const AdSellFeature = dynamic(() => import("@/components/AdSellFeature"));

function Home(params) {
  const { data: session } = useSession();

  // mongooseConnect()
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

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
        <link rel="canonical" href="/" />
      </Head>
      <Layout>
        <HeroSection />
        {/* <LatestProducts /> */}
        {/* 
        <AdSellFeature />
        <Categories />
        <Notification /> */}
      </Layout>
    </>
  );
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: `/login?next=${"/"}`,
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

export default dynamic(() => Promise.resolve(Home), { ssr: false });
