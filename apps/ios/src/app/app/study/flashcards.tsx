import axiosInstance from "@/lib/401Interceptor";
import { Card } from "@prisma/client";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

const Flashcards = () => {
  const router = useRouter();
  const pathName = usePathname();

  const [waiting, setWaiting] = useState<boolean>(false);

  const { id, title, topic } = useLocalSearchParams();

  const [cards, setCards] = useState<Card[] | null>(null);

  const [shownCard, setShownCard] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  useEffect(() => {
    async function getCards() {
      setWaiting(true);
      const req = await axiosInstance.get(
        `${process.env.EXPO_PUBLIC_API_SERVER_URL}/cardset/s/cards/${id}`,
        {
          withCredentials: true,
        },
      );

      const data = await req.data;
      setCards(data);
      setWaiting(false);
    }
    getCards();

    // reset state
    setShownCard(0);
    setIsCardFlipped(false);
  }, [pathName]);

  const handleCardFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setIsCardFlipped(!isCardFlipped);
  };

  const handleNextPress = () => {
    setIsCardFlipped(false);
    if (shownCard + 1 >= cards.length) {
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // loop back to beginning
    }
    setShownCard(shownCard + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleBackPress = () => {
    setIsCardFlipped(false);
    if (shownCard - 1 < 0) {
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // loop back to beginning
    }
    setShownCard(shownCard - 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  return (
    <TouchableWithoutFeedback key={pathName}>
      <View className="flex h-screen bg-black">
        <View className="p-8">
          <ChevronLeftIcon
            size={20}
            color={"white"}
            onPress={() => router.replace("/app/home")}
          />
        </View>
        <View className="flex items-center mx-auto my-12">
          <Text className="text-white font-semibold text-3xl">{title}</Text>
          <Text className="text-gray-700 font-medium text-xl">
            {!topic ? "No Topic" : topic}
          </Text>
        </View>
        <View className="px-12 flex">
          {waiting ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            <Pressable
              className="flex bg-white w-full items-center py-32 rounded-xl"
              onPress={() => handleCardFlip()}
            >
              {cards && !waiting && (
                <Text className="text-black font-semibold">
                  {isCardFlipped
                    ? cards[shownCard].definition
                    : cards[shownCard].term}
                </Text>
              )}
            </Pressable>
          )}
          <View className="flex flex-row mt-12 justify-evenly">
            <Pressable
              className="p-4 rounded-lg bg-[#ff8fab]"
              onPress={() => handleBackPress()}
            >
              <ArrowLeftIcon size={30} color={"white"} />
            </Pressable>
            <Pressable
              className="p-4 rounded-lg bg-[#ff8fab]"
              onPress={() => handleNextPress()}
            >
              <ArrowRightIcon size={30} color={"white"} />
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Flashcards;
