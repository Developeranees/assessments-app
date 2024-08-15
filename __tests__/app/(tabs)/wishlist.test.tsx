import React from "react";
import { render, fireEvent } from "test/tamagui-setup-test";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useWishListState from "states/wishlist.state";
import Wishlist from "app/(tabs)/wishlist";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock("states/wishlist.state", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("components/products/SingleProductCard", () => "SingleProductCard");

describe("Wishlist-anees", () => {
  const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;
  const mockUseWishListState = useWishListState as unknown as jest.Mock;

  beforeEach(() => {
    mockUseSafeAreaInsets.mockReturnValue({ top: 20 });
    mockUseWishListState.mockReturnValue({
      wishList: [],
      clearWishList: jest.fn(),
    });
  });

  it("renders correctly with empty wishlist", () => {
    const { getByText } = render(<Wishlist />);

    expect(getByText("Wishlist")).toBeTruthy();
    expect(getByText("Clear All")).toBeTruthy();
    expect(getByText("Your wishlist is empty")).toBeTruthy();
  });

  it("renders wishlist items when available", () => {
    const mockWishList = [
      { id: 1, title: "Product 1" },
      { id: 2, title: "Product 2" },
    ];
    mockUseWishListState.mockReturnValue({
      wishList: mockWishList,
      clearWishList: jest.fn(),
    });

    const { getByText, queryByText, UNSAFE_getByProps } = render(<Wishlist />);

    expect(getByText("Wishlist")).toBeTruthy();
    expect(getByText("Clear All")).toBeTruthy();
    expect(queryByText("Your wishlist is empty")).toBeNull();
    expect(
      UNSAFE_getByProps({
        title: "Product 1",
      })
    ).toBeTruthy();
    expect(
      UNSAFE_getByProps({
        title: "Product 2",
      })
    ).toBeTruthy();
  });

  it("calls clearWishList when Clear All is pressed", () => {
    const mockClearWishList = jest.fn();
    mockUseWishListState.mockReturnValue({
      wishList: [],
      clearWishList: mockClearWishList,
    });

    const { getByText } = render(<Wishlist />);

    fireEvent.press(getByText("Clear All"));
    expect(mockClearWishList).toHaveBeenCalledTimes(1);
  });
});
