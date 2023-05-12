import { useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Banner } from "~/components/Landing/Banner";
import { Features } from "~/components/Landing/Features";
import { Header } from "~/components/Landing/Header";
import { Learn } from "~/components/Landing/Learn";

const LandingPage: NextPage = () => {
  const { isSignedIn } = useAuth();
  const { push } = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      void push("/home");
    }
  }, [isSignedIn, push]);

  return (
    <div>
      <Banner />
      <Header />
      <Learn />
      <Features />
    </div>
  );
};

export default LandingPage;
