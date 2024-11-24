import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import axiosInstance from "@/lib/401Interceptor";
import { CardSet } from "@prisma/client";
import SetCard from "@/components/home/SetCard";
import { usePathname } from "expo-router";
const Home = () => {
  const pathName = usePathname();

  const { signOut, updateUserState } = useContext(AuthContext);
  const [cardSets, setCardSets] = useState<CardSet[] | null>(null);
  async function callAPI() {
    setCardSets(null);
    const query = await axiosInstance.get(
      `${process.env.EXPO_PUBLIC_API_SERVER_URL}/cardset/s/actions`,
      {
        withCredentials: true,
      },
    );
    const data = await query.data;
    setCardSets(data);
  }

  useEffect(() => {
    callAPI();
  }, [pathName]);

  return (
    <TouchableWithoutFeedback onPress={() => updateUserState()}>
      <View className="flex h-screen bg-black p-4">
        <Text className="text-white text-2xl font-semibold" onPress={signOut}>
          Home
        </Text>
        <View className="mt-6 flex flex-col gap-4">
          {cardSets &&
            cardSets.map((card, index) => (
              <SetCard
                key={index}
                title={card.title}
                description={card.description}
                id={card.id}
                topic={card.topic}
              />
            ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;
