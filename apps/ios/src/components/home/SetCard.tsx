import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { Pressable, Text } from "react-native";

interface SetCardProps {
  id: string;
  title: string;
  description: string;
  topic: string;
}

const SetCard = ({ id, title, description, topic }: SetCardProps) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  return (
    <Pressable
      key={id}
      className="flex flex-col bg-white rounded-lg px-4 py-3"
      onPress={() =>
        router.push({
          pathname: "/app/study/flashcards",
          params: { id: id, title: title, topic: topic },
        })
      }
    >
      <Text className="text-xl font-semibold text-black">{title}</Text>
      <Text className="text-md font-medium text-gray-600">
        {description.length > 0 ? description : "This Set has no description"}
      </Text>

      <Text className="text-md text-gray-400 mt-3">
        Owned by {user.name} ● {!topic ? "N/A" : topic}
      </Text>
    </Pressable>
  );
};

export default SetCard;
