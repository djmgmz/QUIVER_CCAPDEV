import { extendTheme } from "@chakra-ui/react";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { Button } from "./button";

export const theme = extendTheme({
  fonts: {
    body: "Poppins, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "brand.200",
      },
    },
  },
  components: {
    Button,
  },
});
