import Layout from "@/components/Layout";

import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
const HeroSection = dynamic(() => import("@/components/Herosection"));
const LatestProducts = dynamic(() => import("@/components/LatestProducts"));
const Notification = dynamic(() => import("@/components/Notification"));
const Categories = dynamic(() => import("@/components/Categories"));
const AdSellFeature = dynamic(() => import("@/components/AdSellFeature"));

function Home(params) {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" && !session) {
      router.push(`/login?next=${"/"}`);
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
        <LatestProducts />
        <AdSellFeature />
        <Categories />
        <Notification />
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

export default Home;
