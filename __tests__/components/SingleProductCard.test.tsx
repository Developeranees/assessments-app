import { render, fireEvent } from "test/tamagui-setup-test";
import SingleProductCard from "components/products/SingleProductCard";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import useWishListState from "states/wishlist.state";

// Mock the dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("expo-image", () => {
  const actualExpoImage = jest.requireActual("expo-image");
  const { Image } = jest.requireActual("react-native");

  return { ...actualExpoImage, Image };
});

jest.mock("expo-font");
jest.mock("expo-asset");

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}));

jest.mock("states/wishlist.state", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("SingleProductCard", () => {
  const mockProduct = {
    id: 1,
    title: "Essence Mascara Lash Princess",
    rating: 4.94,
    price: 9.99,
    thumbnail:
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    description:
      "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    brand: "Essence",
  };

  const mockQueryClient = {
    setQueryData: jest.fn(),
  };

  const mockWishListState = {
    isProductInWishList: jest.fn(),
    addToWishList: jest.fn(),
    removeFromWishList: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    (useWishListState as unknown as jest.Mock).mockReturnValue(
      mockWishListState
    );
  });

  it("renders correctly", async () => {
    const { getByText } = render(<SingleProductCard {...mockProduct} />);

    expect(getByText(mockProduct.title)).toBeDefined();
    expect(getByText(`${mockProduct.price} AED`)).toBeDefined();
    expect(getByText("View Details")).toBeDefined();
  });

  it("navigates to product details on press", async () => {
    const { getByText } = render(<SingleProductCard {...mockProduct} />);

    const viewDetailsButton = getByText("View Details");
    fireEvent.press(viewDetailsButton);

    expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
      ["product", String(mockProduct.id)],
      mockProduct
    );
    expect(router.push).toHaveBeenCalledWith(`/product/${mockProduct.id}`);
  });

  it("added to wishlist pressed", async () => {
    mockWishListState.isProductInWishList.mockReturnValue(false);

    const { getByTestId } = render(<SingleProductCard {...mockProduct} />);

    const wishlistIcon = getByTestId("wishlist-icon");
    fireEvent.press(wishlistIcon);

    expect(mockWishListState.addToWishList).toHaveBeenCalledWith(mockProduct);
  });

  it("removed to wishlist pressed ", async () => {
    mockWishListState.isProductInWishList.mockReturnValue(true);

    const { getByTestId } = render(<SingleProductCard {...mockProduct} />);

    const wishlistIcon = getByTestId("wishlist-icon");
    fireEvent.press(wishlistIcon);

    expect(mockWishListState.removeFromWishList).toHaveBeenCalledWith(
      mockProduct.id
    );
  });
});
