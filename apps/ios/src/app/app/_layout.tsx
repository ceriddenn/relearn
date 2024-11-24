import { Tabs } from "expo-router";
import { View, Animated, Easing } from "react-native";
import { useState, useEffect } from "react";
import {
  BookIcon,
  HomeIcon,
  UserIcon,
  PlusCircleIcon,
} from "lucide-react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          left: 50,
          right: 50,
          height: 65,
          backgroundColor: "black",
          borderRadius: 16,
          borderTopColor: "black",
          paddingBottom: 0,
          justifyContent: "space-between",
          alignItems: "center",
        },
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 0,
          marginHorizontal: 0,
        },
        tabBarIconStyle: {
          marginHorizontal: 0,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => (
          <AnimatedIconWithCircle
            focused={focused}
            route={route.name}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen
        name="add/index"
        options={{
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen name="cardSets" />
      <Tabs.Screen name="account" />

      {/*  Ignored Routes */}

      <Tabs.Screen
        name="add/set"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
        }}
      />
    </Tabs>
  );
}

function AnimatedIconWithCircle({ focused, route, color, size }) {
  const [scale] = useState(new Animated.Value(1)); // Scale animation state

  // Run the animation when `focused` changes
  useEffect(() => {
    Animated.timing(scale, {
      toValue: focused ? 1.2 : 1, // Slightly scale up the icon when active
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {focused && (
        <View
          style={{
            position: "absolute",
            padding: 25,
            borderRadius: 16,
            backgroundColor: "#ff8fab",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}
      <Animated.View
        style={{
          transform: [{ scale }],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {route === "home" && <HomeIcon color={color} size={size} />}
        {route === "cardSets" && <BookIcon color={color} size={size} />}
        {route === "add/index" && <PlusCircleIcon color={color} size={size} />}
        {route === "account" && <UserIcon color={color} size={size} />}
      </Animated.View>
    </View>
  );
}
