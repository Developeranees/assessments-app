import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Dimensions } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1b1b1c",
          borderTopLeftRadius: 100,
          borderRadius: 100,
          height: 48,
          position: "absolute",
          bottom: 16,
          maxWidth: 180,
          left: Dimensions.get("screen").width / 2 - 90,
        },
        headerShown: false,
        tabBarItemStyle: {
          height: 48,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Products",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarActiveTintColor: "red",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="heart" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
