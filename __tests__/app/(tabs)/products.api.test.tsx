import { renderHook, act, waitFor, render } from "test/tamagui-setup-test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Products from "app/(tabs)";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AxiosApiPagedResponse } from "types & schemas/common.types";
import { IProduct } from "types & schemas/product.types";

jest.mock("axios");
jest.mock("expo-asset");
jest.mock("expo-font");
jest.mock("expo-image", () => {
  const actualExpoImage = jest.requireActual("expo-image");
  const { Image } = jest.requireActual("react-native");
  return { ...actualExpoImage, Image };
});
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe("Products", () => {
  let queryClient: QueryClient;
  let mockAxiosGet: jest.MockedFunction<typeof axios.get>;

  beforeEach(() => {
    const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    mockUseSafeAreaInsets.mockReturnValue({ top: 20 });
    (axios.get as jest.Mock).mockClear();
    mockAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;
  });

  it("fetches data correctly and handles pagination", async () => {
    // Mock the API responses for pagination
    mockAxiosGet
      .mockResolvedValueOnce({
        data: { products: [{ id: 1, title: "Product 1" }], limit: 30, skip: 0 },
      })
      .mockResolvedValueOnce({
        data: {
          products: [{ id: 2, title: "Product 2" }],
          limit: 30,
          skip: 30,
        },
      })
      .mockResolvedValueOnce({ data: { products: [], limit: 10, skip: 60 } });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () =>
        useInfiniteQuery({
          queryKey: ["products"],
          queryFn: async ({ pageParam }) => {
            const response: AxiosApiPagedResponse<IProduct[]> = await axios.get(
              `/products?skip=${pageParam * 30}&limit=30`
            );
            return response.data;
          },
          initialPageParam: 0,
          getNextPageParam: (lastPage) => {
            if (lastPage.limit < 30) return undefined;
            return lastPage.skip / 30 + 1;
          },
        }),
      { wrapper: Wrapper }
    );

    render(
      <Wrapper>
        <Products />
      </Wrapper>
    );

    // Wait for the first page of data to load
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Fetch the next page
    await act(async () => {
      await waitFor(() => result.current.fetchNextPage());
    });

    // Wait for the second page of data to load
    await waitFor(() => {
      return result.current.isFetching === false;
    });

    // Fetch the third page
    await act(async () => {
      await waitFor(() => result.current.fetchNextPage());
    });

    // Wait for the third page of data to load
    await waitFor(() => {
      return result.current.isFetching === false;
    });

    await waitFor(() => expect(result.current.isError).toBe(false));
  });
});
