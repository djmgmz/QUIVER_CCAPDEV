import { RecoilRoot } from "recoil";
import "@/view/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Layout from "@/view/Layout/Layout";
import { useRouter } from "next/router";
import { theme as baseTheme } from "../view/chakra/theme";
import { ThemeProvider, useTheme } from "@/view/chakra/themecontext";
import RememberMeRefresher from "@/model/Cookies/RememberMeRefresher";


const DynamicThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  
  const dynamicTheme = extendTheme({
    ...baseTheme,
    colors: {
      brand: theme,
    },
  });

  return <ChakraProvider theme={dynamicTheme}>{children}</ChakraProvider>;
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPostPage = router.pathname.includes("/post");

  return (
    <RecoilRoot>
      <ThemeProvider>
      <DynamicThemeProvider>
        <RememberMeRefresher />
        {!isPostPage ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </DynamicThemeProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
