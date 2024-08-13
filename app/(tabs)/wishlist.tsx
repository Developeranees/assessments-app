import { FlashList } from "@shopify/flash-list";
import SingleProductCard from "components/products/SingleProductCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useWishListState from "states/wishlist.state";
import { XStack, YStack } from "tamagui";
import Typography from "ui/typography";

const Wishlist = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { wishList, clearWishList } = useWishListState();

  return (
    <YStack pt={top} pb={bottom} f={1} bg="white">
      <XStack px="$16" my="$8" ai="center" jc="space-between">
        <Typography size="$25" bold>
          Wishlist
        </Typography>
        <YStack onPress={clearWishList} ai="center" jc="center">
          <Typography
            size="$14"
            textDecorationStyle="solid"
            textDecorationLine="underline"
            semiBold
          >
            Clear All
          </Typography>
        </YStack>
      </XStack>
      <FlashList
        estimatedItemSize={112}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        keyExtractor={(item) => item.id.toString()}
        data={wishList}
        renderItem={({ item }) => <SingleProductCard {...item} />}
        ItemSeparatorComponent={() => <YStack h="$16" />}
        ListEmptyComponent={() => (
          <YStack py="$4">
            <Typography size="$16" px="$16" ta="center">
              Your wishlist is empty
            </Typography>
          </YStack>
        )}
      />
    </YStack>
  );
};

export default Wishlist;
