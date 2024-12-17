import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import axiosInstance from "@/lib/401Interceptor";
import { CardSet } from "@prisma/client";
import SetCard from "@/components/home/SetCard";
import { usePathname } from "expo-router";
const Home = () => {
  const pathName = usePathname();

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
    <TouchableWithoutFeedback>
      <View className="flex h-full bg-black p-4">
        <Text className="text-white text-2xl font-semibold">Home</Text>
        <View className="mt-6 flex flex-col gap-4" style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 65 }}
          >
            {cardSets &&
              cardSets.map((card, index) => (
                <View key={index} className="mb-4">
                  <SetCard
                    title={card.title}
                    description={card.description}
                    id={card.id}
                    topic={card.topic}
                  />
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;
