import { FC } from "react";
import { Separator, XStack, YStack } from "tamagui";
import { Image } from "expo-image";
import Typography from "ui/typography";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { IProduct } from "types & schemas/product.types";
import { useQueryClient } from "@tanstack/react-query";
import useWishListState from "states/wishlist.state";

interface IProps extends IProduct {}

const SingleProductCard: FC<IProps> = (product) => {
  const queryClient = useQueryClient();
  const { isProductInWishList, addToWishList, removeFromWishList } =
    useWishListState();

  const onItemPress = () => {
    queryClient.setQueryData(["product", String(product.id)], product);
    router.push(`/product/${product.id}`);
  };

  return (
    <XStack onPress={onItemPress} bw="$1" boc="$gray/300" br="$2" p="$8">
      <YStack h="$80" w="$80">
        <Image
          priority="high"
          cachePolicy="memory-disk"
          alt={product.title}
          source={product.thumbnail}
          style={{ flex: 1 }}
          contentFit="cover"
        />
      </YStack>
      <Separator mx="$16" vertical boc="$gray/300" />
      <YStack f={1}>
        <XStack jc="space-between">
          <Typography f={1} mr="$4" size="$16" medium>
            {product.title}
          </Typography>

          <XStack>
            {isProductInWishList(product.id) ? (
              <XStack
                testID="wishlist-icon"
                onPress={() => removeFromWishList(product.id)}
              >
                <MaterialCommunityIcons
                  name="heart-multiple"
                  size={24}
                  color="red"
                />
              </XStack>
            ) : (
              <XStack
                testID="wishlist-icon"
                onPress={() => addToWishList(product)}
              >
                <MaterialCommunityIcons
                  name="heart-multiple-outline"
                  size={24}
                  color="black"
                />
              </XStack>
            )}
          </XStack>
        </XStack>
        <Typography mt="$4" size="$16" semiBold>
          {product.price} AED
        </Typography>

        <XStack
          f={1}
          alignSelf="flex-end"
          mt="$8"
          jc="flex-end"
          ai="flex-end"
          mr="$4"
        >
          <Typography size="$14" textDecorationLine="underline">
            View Details
          </Typography>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default SingleProductCard;
