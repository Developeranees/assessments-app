import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, XStack, YStack } from "tamagui";
import Typography from "ui/typography";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { truncate } from "lodash";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct } from "types & schemas/product.types";
import useWishListState from "states/wishlist.state";

const ViewSingleProduct = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const { isProductInWishList, addToWishList, removeFromWishList } =
    useWishListState();

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get<IProduct>(
        `/products/${id}?select=id,title,rating,price,thumbnail,description,brand`
      );
      return response.data;
    },
    enabled: Boolean(id),
  });

  return (
    <YStack f={1} pt={top} pb={bottom} bg="white">
      <XStack
        jc="space-between"
        bw="$1"
        boc="$gray/300"
        ai="center"
        px="$16"
        py="$8"
      >
        <MaterialCommunityIcons
          name="arrow-u-left-top"
          size={28}
          color="black"
          onPress={() => router.back()}
          testID="back-button"
        />

        <Typography mx="$8" semiBold f={1} ta="center">
          {truncate(product?.title, { length: 30 })}
        </Typography>

        {product?.id && isProductInWishList(product.id) ? (
          <MaterialCommunityIcons
            testID="wishlist-button"
            onPress={() => removeFromWishList(product.id)}
            name="heart-multiple"
            size={28}
            color="red"
          />
        ) : (
          <MaterialCommunityIcons
            testID="wishlist-button"
            name="heart-multiple-outline"
            size={28}
            color="black"
            onPress={() => product && addToWishList(product)}
          />
        )}
      </XStack>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack jc="center" bbw="$1" bbc="$gray/300" h="$280">
          <Image
            source={product?.thumbnail}
            style={{ flex: 1 }}
            contentFit="contain"
            priority="high"
            cachePolicy="disk"
            testID="product-thumbnail"
          />
        </YStack>
        <YStack py="$16">
          <YStack bbc="$gray/300" bbw="$1" pb="$8" px="$16">
            <Typography size="$16" bold>
              {product?.title}
            </Typography>

            <Typography mt="$4" size="$16" col="$gray/700">
              Price : <Typography semiBold>{product?.price} AED</Typography>
            </Typography>
            {product?.brand && (
              <Typography mt="$4" size="$16" col="$gray/700">
                Brand : <Typography semiBold>{product?.brand}</Typography>
              </Typography>
            )}
            <Typography mt="$4" size="$16" col="$gray/700">
              Rating :{" "}
              <Typography semiBold>
                {Number(product?.rating).toFixed(1)}{" "}
                <AntDesign name="star" size={16} color="black" />
              </Typography>
            </Typography>
          </YStack>
          <Typography mt="$8" size="$16" px="$16" col="$gray/800">
            {product?.description}
          </Typography>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default ViewSingleProduct;
