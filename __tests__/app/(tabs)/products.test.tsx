import React from "react";
import { render, fireEvent, waitFor } from "test/tamagui-setup-test";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Products from "app/(tabs)/index";

jest.mock("axios");

jest.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock("components/products/SingleProductCard", () => "SingleProductCard");

describe("Products", () => {
  const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;
  const mockUseInfiniteQuery = useInfiniteQuery as jest.Mock;

  beforeEach(() => {
    mockUseSafeAreaInsets.mockReturnValue({ top: 20 });
  });

  it("renders loading state correctly", () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    const { getByText, getByTestId } = render(<Products />);

    expect(getByText("Products")).toBeTruthy();
    expect(getByTestId("loading-spinner")).toBeTruthy();
  });

  it("renders empty state correctly", () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    const { getByText } = render(<Products />);

    expect(getByText("Products")).toBeTruthy();
    expect(getByText("No Products Found!")).toBeTruthy();
  });

  it("renders products correctly", () => {
    const mockProducts = [
      { id: 1, title: "Product 1" },
      { id: 2, title: "Product 2" },
    ];
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ products: mockProducts }] },
      isLoading: false,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    const { getByText, UNSAFE_getByProps } = render(<Products />);

    expect(getByText("Products")).toBeTruthy();
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

  it("fetches next page when reaching the end", async () => {
    const mockFetchNextPage = jest.fn();
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ products: [{ id: 1, title: "Product 1" }] }] },
      isLoading: false,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });

    const { getByTestId } = render(<Products />);

    const flashList = getByTestId("flash-list");
    fireEvent(flashList, "endReached");

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  it('shows "No more data" when all data is loaded', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ products: [{ id: 1, title: "Product 1" }] }] },
      isLoading: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    const { getByText } = render(<Products />);

    expect(getByText("No more data")).toBeTruthy();
  });

  it("shows loader when fetching next page", () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ products: [{ id: 1, title: "Product 1" }] }] },
      isLoading: false,
      hasNextPage: false,
      isFetchingNextPage: true,
      fetchNextPage: jest.fn(),
    });

    const { getByTestId } = render(<Products />);

    expect(getByTestId("fetching-spinner")).toBeTruthy();
  });
});
