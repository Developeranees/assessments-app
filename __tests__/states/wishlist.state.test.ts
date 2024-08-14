import { act, renderHook } from "@testing-library/react-native";
import useWishListState from "states/wishlist.state";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const getMockProduct = (id: number) => {
  return {
    id,
    title: "Essence Mascara Lash Princess",
    rating: 4.94,
    price: 9.99,
    thumbnail:
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    description:
      "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    brand: "Essence",
  };
};

describe("useWishListState", () => {
  beforeEach(() => {
    // Clear the store before each test
    const { result } = renderHook(() => useWishListState());
    act(() => {
      result.current.clearWishList();
    });
  });

  it("should initialize with an empty wishlist", () => {
    const { result } = renderHook(() => useWishListState());
    expect(result.current.wishList).toEqual([]);
  });

  it("should add a product to the wishlist", () => {
    const { result } = renderHook(() => useWishListState());
    const product = getMockProduct(1);

    act(() => {
      result.current.addToWishList(product);
    });

    expect(result.current.wishList).toContainEqual(product);
  });

  it("should remove a product from the wishlist", () => {
    const { result } = renderHook(() => useWishListState());
    const product = getMockProduct(1);

    act(() => {
      result.current.addToWishList(product);
      result.current.removeFromWishList(product.id);
    });

    expect(result.current.wishList).not.toContainEqual(product);
  });

  it("should clear the wishlist", () => {
    const { result } = renderHook(() => useWishListState());
    const product1 = getMockProduct(1);
    const product2 = getMockProduct(2);

    act(() => {
      result.current.addToWishList(product1);
      result.current.addToWishList(product2);
      result.current.clearWishList();
    });

    expect(result.current.wishList).toEqual([]);
  });

  it("should check if a product is in the wishlist", () => {
    const { result } = renderHook(() => useWishListState());
    const product = getMockProduct(1);

    act(() => {
      result.current.addToWishList(product);
    });

    expect(result.current.isProductInWishList(product.id)).toBe(true);
    expect(result.current.isProductInWishList(2)).toBe(false);
  });
});
