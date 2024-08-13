import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { createFont, createTamagui } from "tamagui";
import { createAnimations } from "@tamagui/animations-react-native";
import { themes, tokens } from "theme";

const animations = createAnimations({
  bouncy: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});

const interFont = createFont({
  family: "Inter",
  size: {
    "8": 8,
    "9": 9,
    "10": 10,
    "11": 11,
    "12": 12,
    "13": 13,
    "14": 14,
    "15": 15,
    "16": 16,
    true: 16,
    "17": 17,
    "18": 18,
    "20": 20,
    "25": 25,
    "31": 31,
    "39": 39,
    "49": 49,
    "61": 61,
  },
  weight: {},
  lineHeight: {
    "10": 12,
    "11": 13.2,
    "12": 14.4,
    "13": 15.6,
    "14": 16.8,
    "16": 19.2,
    true: 19.2,
    "18": 21.6,
    "20": 24.0,
    "25": 30.0,
    "31": 37.2,
    "39": 46.8,
    "49": 58.8,
    "61": 73.2,
  },
  letterSpacing: {},
  face: {
    100: {
      normal: "Inter-Thin",
    },
    200: {
      normal: "Inter-ExtraLight",
    },
    300: {
      normal: "Inter-Light",
    },
    400: {
      normal: "Inter-Regular",
    },
    500: {
      normal: "Inter-Medium",
    },
    600: {
      normal: "Inter-SemiBold",
    },
    700: {
      normal: "Inter-Bold",
    },
    800: {
      normal: "Inter-ExtraBold",
    },
    900: {
      normal: "Inter-Black",
    },
  },
});

const config = createTamagui({
  reactNative: true,
  animations,
  defaultTheme: "light",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: interFont,
    body: interFont,
  },
  themes,
  tokens,
  media: createMedia({
    lgMobiles: {
      minWidth: 375,
    },
    tablet: {
      minWidth: 768,
    },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  }),
});
export type AppConfig = typeof config;
declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
  // interface ThemeValueFallback {
  //   value: never;
  // }
}
export default config;
