import { Input } from "@/components/input";
import { useRouter } from "expo-router";
import { ChevronLeftIcon, MinusIcon, PlusIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Card {
  term: string;
  defnintion: string;
}

const Set = () => {
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>([{ term: "", defnintion: "" }]);

  const handleAddPress = () => {
    setCards((cards) => [...cards, { term: "", defnintion: "" }]);
  };

  const handleCreateCard = () => {};

  const handleRemoveCard = (index: number) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards); // Update state with the new array
  };

  return (
    <>
      <TouchableWithoutFeedback className="flex h-screen">
        <View className="flex h-screen bg-black p-4 flex-row">
          <View className="flex flex-col">
            <View className="flex flex-row">
              <ChevronLeftIcon
                size={20}
                color={"white"}
                onPress={() => router.replace("/app/add")}
              />
            </View>
            <View className="flex flex-col mt-2">
              <View className="flex flex-row items-center">
                <Text
                  className="text-white text-2xl font-semibold"
                  onPress={() => handleCreateCard()}
                >
                  Create a&nbsp;
                </Text>
                <View className="bg-[#FF6F61] rounded-lg  p-1 px-2">
                  <Text className="text-white text-2xl font-semibold">
                    StudySet
                  </Text>
                </View>
              </View>
              <Text className="text-gray-700 text-md font-medium">
                Add a minimum of 3 terms to create a set.
              </Text>
            </View>

            <View className="flex flex-col mt-6">
              <View className="flex gap-2">
                <View className="flex-row gap-1 items-center">
                  <Text className="font-semibold text-md text-white">
                    Title
                  </Text>
                </View>

                <View className="flex-row items-center px-4 py-1 border-[1.5px] border-[#D25B7E] rounded-lg gap-3 ">
                  <Input placeholder="Algebra Terms" className="w-full pr-12" />
                </View>
              </View>
              <Pressable className="ml-auto mt-2">
                <Text className="font-semibold text-md text-[#FF6F61]">
                  + Description
                </Text>
              </Pressable>
            </View>

            <View className="flex my-6">
              <Pressable
                onPress={handleAddPress}
                className="border-[1.5px] rounded-lg bg-[#ff8fab] items-center py-2"
              >
                <Text className={"text-[#D25B7E] font-medium text-lg"}>
                  Create Set
                </Text>
              </Pressable>
            </View>

            <View className="flex-1 mt-6">
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
              >
                {cards.map((card, i) => (
                  <Pressable
                    className="flex gap-3 mb-3 rounded-xl bg-[#] p-3"
                    key={i}
                  >
                    <View className="flex gap-2">
                      <View className="flex flex-row">
                        <Text className="font-semibold text-md text-[#FFD700]">
                          Term
                        </Text>
                        <Pressable
                          className="ml-auto right-0"
                          onPress={() => handleRemoveCard(i)}
                        >
                          <MinusIcon color={"#ff8fab"} />
                        </Pressable>
                      </View>
                      <View className="flex-row items-center px-4 border-[1.5px] border-[#36454F] rounded-lg">
                        <Input
                          placeholder="2+2"
                          className="w-full pr-12 "
                          onChangeText={(termText) => {
                            cards[i].term = termText;
                          }}
                        />
                      </View>
                    </View>
                    <View className="gap-2">
                      <Text className="font-semibold text-md text-[#FFD700]">
                        Definition
                      </Text>

                      <View className="flex-row items-center px-4 border-[1.5px] border-[#36454F] rounded-lg">
                        <Input placeholder="4" className="w-full pr-12" />
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Pressable
        className="absolute bottom-5 right-5 bg-[#ff8fab] p-2 rounded-3xl"
        onPress={() => handleAddPress()}
      >
        <PlusIcon color={"#D25B7E"} />
      </Pressable>
    </>
  );
};

export default Set;
