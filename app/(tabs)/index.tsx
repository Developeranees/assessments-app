import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import SingleProductCard from "components/products/SingleProductCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spinner, XStack, YStack } from "tamagui";
import { AxiosApiPagedResponse } from "types & schemas/common.types";
import { IProduct } from "types & schemas/product.types";
import Typography from "ui/typography";

const Products = () => {
  const { top } = useSafeAreaInsets();

  const {
    data: { pages: fetchedPages = [] } = {},
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: async ({ pageParam }) => {
      const response: AxiosApiPagedResponse<IProduct[]> = await axios.get(
        `/products?skip=${
          pageParam * 30
        }&limit=30&select=id,title,rating,price,thumbnail,description,brand`
      );

      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.limit < 30) return undefined;
      return lastPage?.skip / 30 + 1;
    },
  });

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const productsData = fetchedPages?.map((data) => data.products).flat();

  return (
    <YStack pt={top} f={1} bg="white">
      <Typography size="$25" bold px="$16" my="$8">
        Products
      </Typography>
      <FlashList
        testID="flash-list"
        estimatedItemSize={112}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 48 + 16,
        }}
        keyExtractor={(item) => item.id.toString()}
        data={productsData}
        renderItem={({ item }) => <SingleProductCard {...item} />}
        ItemSeparatorComponent={() => <YStack h="$16" />}
        ListEmptyComponent={
          isLoading ? (
            <XStack p="$8" w="100%" ai="center" jc="center">
              <Spinner testID="loading-spinner" size="small" color="#1b1b1c" />
            </XStack>
          ) : (
            <XStack p="$8" w="100%" ai="center" jc="center">
              <Typography>No Products Found!</Typography>
            </XStack>
          )
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <XStack p="$8" w="100%" ai="center" jc="center">
            {isFetchingNextPage && (
              <Spinner testID="fetching-spinner" size="small" color="#1b1b1c" />
            )}
            {!isFetchingNextPage && !hasNextPage && !isLoading && (
              <Typography>No more data</Typography>
            )}
          </XStack>
        }
      />
    </YStack>
  );
};

export default Products;
