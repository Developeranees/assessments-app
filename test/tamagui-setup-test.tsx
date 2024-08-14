// test-setup.js
import React from "react";
import {
  render as rtlRender,
  RenderOptions,
} from "@testing-library/react-native";
import { TamaguiProvider } from "tamagui";
import config from "tamagui.config";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

const renderWithTamaguiProvider = (
  ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  options?: RenderOptions
) => {
  return rtlRender(
    <TamaguiProvider config={config}>{ui}</TamaguiProvider>,
    options
  );
};

// Re-export everything from @testing-library/react-native
export * from "@testing-library/react-native";

// Override the render function to use the wrapper
export { renderWithTamaguiProvider as render };
