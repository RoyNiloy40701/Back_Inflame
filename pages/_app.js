

import Loading from "@/components/Loading";
import ParentComponent from "@/components/ParentComponent";
import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { SessionProvider } from "next-auth/react": { session, ...pageProps };


export default function App({ Component, pageProps}) {
  const [loading, setLoading] = useState(true);
  const [asideOpen, setAsideOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    if (router.isReady) {
      setLoading(false);
    }


    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);

    }
  }, [router]);
  const contAsideOpen= () => {
    setAsideOpen(!asideOpen);
  };
  return (
    <>
    
      {loading ? (
        <div className="flex flex-col flex-center wh_100">
          <Loading />
          <h1 className="mt-1">Loading..</h1>
        </div>
      ) : (
        <>
          <ParentComponent appOpen={asideOpen} appAsideOpen={contAsideOpen} />
          <main>
            <div className={asideOpen ? "container" : "container active"}>
              {/* <SessionProvider session={session}> */}
              <Component {...pageProps} />
              {/* </SessionProvider> */}
            </div>
          </main>
        </>
      )}
    

    </>
  );
}
