import { IProduct } from "types & schemas/product.types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IWishListState {
  wishList: IProduct[];
}

interface IWishListActions {
  addToWishList: (product: IProduct) => void;
  removeFromWishList: (productId: IProduct["id"]) => void;
  clearWishList: () => void;
  isProductInWishList: (productId: IProduct["id"]) => boolean;
}

const useWishListState = create(
  persist(
    immer<IWishListState & IWishListActions>((set, get) => ({
      wishList: [],

      addToWishList: (product) =>
        set((state) => {
          state.wishList.push(product);
        }),

      removeFromWishList: (productId) =>
        set((state) => {
          state.wishList = state.wishList.filter(
            (product) => product.id !== productId
          );
        }),

      clearWishList: () =>
        set((state) => {
          state.wishList = [];
        }),

      isProductInWishList: (productId) =>
        get().wishList.some((product) => product.id === productId),
    })),
    {
      name: "wishlist",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useWishListState;
