import { Input } from "@/components/input";
import axiosInstance from "@/lib/401Interceptor";
import { showToast } from "@/lib/toastConfig";
import { useRouter, usePathname } from "expo-router";
import { ChevronLeftIcon, MinusIcon, PlusIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Card {
  term: string;
  definition: string;
}

const Set = () => {
  const router = useRouter();
  const pathName = usePathname();

  // set to true when request promise is pending, false when fulfilled.
  const [waiting, setWaiting] = useState<boolean>(false);

  const [cards, setCards] = useState<Card[]>([{ term: "", definition: "" }]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [topic, setTopic] = useState<string>("");

  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [showTopic, setShowTopic] = useState<boolean>(false);

  const handleAddPress = () => {
    setCards((cards) => [...cards, { term: "", definition: "" }]);
  };

  const handleRemoveCard = (index: number) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards); // Update state with the new array
  };

  const opacityDescriptionInput = useSharedValue(0); // Start fully transparent
  const opacityTopicInput = useSharedValue(0);

  const animatedStyleDescriptionInput = useAnimatedStyle(() => {
    return {
      opacity: opacityDescriptionInput.value,
    };
  });

  const animatedStyleTopicInput = useAnimatedStyle(() => {
    return {
      opacity: opacityTopicInput.value,
    };
  });

  const handleDescriptionPress = () => {
    setShowDescription(true);
    opacityDescriptionInput.value = withTiming(1, { duration: 300 });
  };

  const handleTopicPress = () => {
    setShowTopic(true);
    opacityTopicInput.value = withTiming(1, { duration: 300 });
  };

  useEffect(() => {
    function resetStates() {
      setShowDescription(false);
      setShowTopic(false);
      opacityDescriptionInput.value = 0;
      opacityTopicInput.value = 0;

      setCards([{ term: "", definition: "" }]);
    }
    resetStates();
  }, [pathName]);

  const handleSetCreatePress = async () => {
    setWaiting(true);
    try {
      const request = await axiosInstance.post(
        `${process.env.EXPO_PUBLIC_API_SERVER_URL}/cardset/s/actions`,
        JSON.stringify({
          title: title,
          topic: topic,
          description: description,
          cards: cards,
        }),
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await request.data;
      setWaiting(false);
      if (data.code && data.code != 200) {
        return showToast("Error", data, "error");
      }
      showToast("Success", "Created the set.", "success");
      router.push("app/home");
    } catch (error) {
      setWaiting(false);
      showToast("Error", error.response.data.message, "error");
    }
  };

  return (
    <>
      <TouchableWithoutFeedback className="flex h-screen" key={pathName}>
        <View className="flex h-screen bg-black p-4 flex-row">
          <View className="flex flex-col">
            <View className="flex flex-row">
              <ChevronLeftIcon
                size={20}
                color={"white"}
                onPress={() => router.navigate("/app/add")}
              />
            </View>
            <View className="flex flex-col mt-2">
              <View className="flex flex-row items-center">
                <Text className="text-white text-2xl font-semibold">
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
                  <Input
                    placeholder="Algebra Terms"
                    className="w-full pr-12"
                    onChangeText={(titleText) => setTitle(titleText)}
                  />
                </View>
              </View>
              {showDescription ? (
                <Animated.View style={animatedStyleDescriptionInput}>
                  <View className="flex gap-2 mt-4 mb-2">
                    <View className="flex-row gap-1 items-center">
                      <Text className="font-semibold text-md text-white">
                        Description
                      </Text>
                    </View>

                    <View className="flex-row items-center px-4 py-1 border-[1.5px] border-[#D25B7E] rounded-lg gap-3 ">
                      <Input
                        placeholder="Addition & Subtraction"
                        className="w-full pr-12"
                        onChangeText={(descriptionText) =>
                          setDescription(descriptionText)
                        }
                      />
                    </View>
                  </View>
                </Animated.View>
              ) : (
                <Pressable
                  className="ml-auto mt-2 mb-2"
                  onPress={() => handleDescriptionPress()}
                >
                  <Text className="font-semibold text-md text-white">
                    + Description
                  </Text>
                </Pressable>
              )}

              {showTopic ? (
                <Animated.View style={animatedStyleTopicInput}>
                  <View className="flex gap-2 mt-2">
                    <View className="flex-row gap-1 items-center">
                      <Text className="font-semibold text-md text-white">
                        Topic Name
                      </Text>
                    </View>

                    <View className="flex-row items-center px-4 py-1 border-[1.5px] border-[#D25B7E] rounded-lg gap-3 ">
                      <Input
                        placeholder="K12 Math"
                        className="w-full pr-12"
                        onChangeText={(topicText) => setTopic(topicText)}
                      />
                    </View>
                  </View>
                </Animated.View>
              ) : (
                <Pressable
                  className="ml-auto"
                  onPress={() => handleTopicPress()}
                >
                  <Text className="font-semibold text-md text-[#7C73E6]">
                    Assign Topic
                  </Text>
                </Pressable>
              )}
            </View>

            <View className="flex my-6">
              <Pressable
                onPress={handleSetCreatePress}
                className="border-2 rounded-lg bg-[#ff8fab] items-center py-2"
              >
                {waiting ? (
                  <ActivityIndicator
                    size={"small"}
                    className="text-[#D25B7E]"
                  />
                ) : (
                  <Text className={"text-[#D25B7E] font-medium text-lg"}>
                    Create Set
                  </Text>
                )}
              </Pressable>
            </View>

            <View className="flex-1 mt-6">
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
              >
                {cards.map((card, i) => (
                  <Pressable
                    className="flex gap-3 mb-3 rounded-xl bg-[#] p-3"
                    key={i}
                  >
                    <View className="flex gap-2">
                      <View className="flex flex-row">
                        <Text className="font-semibold text-md text-white">
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
                      <Text className="font-semibold text-md text-white">
                        Definition
                      </Text>

                      <View className="flex-row items-center px-4 border-[1.5px] border-[#36454F] rounded-lg">
                        <Input
                          placeholder="4"
                          className="w-full pr-12"
                          onChangeText={(definitionText) => {
                            cards[i].definition = definitionText;
                          }}
                        />
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
