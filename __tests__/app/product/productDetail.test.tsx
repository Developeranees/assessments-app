import React from "react";
import { render, fireEvent, waitFor } from "test/tamagui-setup-test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import ViewSingleProduct from "app/product/[id]";
import useWishListState from "states/wishlist.state";

// Mock necessary hooks and modules
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(),
}));
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  router: { back: jest.fn() },
}));
jest.mock("axios");
jest.mock("states/wishlist.state", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("expo-asset");
jest.mock("expo-font");
jest.mock("expo-image", () => {
  const actualExpoImage = jest.requireActual("expo-image");
  const { Image } = jest.requireActual("react-native");
  return { ...actualExpoImage, Image };
});

const queryClient = new QueryClient();

const mockProduct = {
  id: "1",
  title: "Product Title",
  rating: 4.5,
  price: 100,
  thumbnail: "https://example.com/thumbnail.jpg",
  description: "Product Description",
  brand: "Brand Name",
};

const mockWishListState = {
  isProductInWishList: jest.fn(),
  addToWishList: jest.fn(),
  removeFromWishList: jest.fn(),
};

describe("ViewSingleProduct", () => {
  beforeEach(() => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 10, bottom: 10 });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "1" });
    (axios.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    (useWishListState as unknown as jest.Mock).mockReturnValue(
      mockWishListState
    );
  });

  it("renders product details correctly", async () => {
    const { getByText, getByTestId, getAllByText } = render(
      <QueryClientProvider client={queryClient}>
        <ViewSingleProduct />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getAllByText("Product Title")).toBeTruthy();
      expect(getByText("100 AED")).toBeTruthy();
      expect(getByText("Brand Name")).toBeTruthy();
      expect(getByText("Product Description")).toBeTruthy();
      expect(getByTestId("product-thumbnail")).toBeTruthy();
    });
  });

  it("handles back navigation", async () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ViewSingleProduct />
      </QueryClientProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("back-button"));
    });

    expect(router.back).toHaveBeenCalled();
  });

  it("handles add to wishlist functionality", async () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ViewSingleProduct />
      </QueryClientProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("wishlist-button"));
    });

    expect(useWishListState().addToWishList).toHaveBeenCalledWith(mockProduct);
  });

  it("handles remove from wishlist functionality", async () => {
    mockWishListState.isProductInWishList.mockReturnValue(true);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ViewSingleProduct />
      </QueryClientProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("wishlist-button"));
    });

    expect(mockWishListState.removeFromWishList).toHaveBeenCalledWith(
      mockProduct.id
    );
  });
});
