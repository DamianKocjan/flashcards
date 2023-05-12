import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { Montserrat } from "next/font/google";

import { Footer } from "~/components/App/Footer";
import { Nav } from "~/components/App/Nav";
import { api } from "~/utils/api";

import "~/styles/globals.css";

const montserrat = Montserrat({
  subsets: ["latin-ext"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <div className={montserrat.className}>
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
