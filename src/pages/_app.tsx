import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import { api } from "@/lib/api";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={poppins.className}>
        <Component {...pageProps} />
        <Toaster />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
