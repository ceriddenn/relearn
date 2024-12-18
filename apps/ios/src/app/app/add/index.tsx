import { useRouter } from "expo-router";
import {
  BookIcon,
  ChevronLeftIcon,
  PaperclipIcon,
  PencilIcon,
} from "lucide-react-native";
import React from "react";
import { Pressable, Text, TouchableWithoutFeedback, View } from "react-native";

interface Element {
  title: string;
  icon: React.ReactElement;
  href: string;
}

const Add = () => {
  const router = useRouter();

  const Elements: Element[] = [
    {
      title: "Create a StudySet",
      icon: <BookIcon size={20} color="white" style={{ marginLeft: 12 }} />,
      href: "app/add/set",
    },
    // {
    //   title: "Create a Study Guide",
    //   icon: (
    //     <PaperclipIcon size={20} color="white" style={{ marginLeft: 12 }} />
    //   ),
    //   href: "app/add/StudyGuide",
    // },
    // {
    //   title: "Create Notes",
    //   icon: <PencilIcon size={20} color="white" style={{ marginLeft: 12 }} />,
    //   href: "app/add/Notes",
    // },
  ];

  return (
    <TouchableWithoutFeedback>
      <View className="flex h-screen bg-black p-4">
        <View className="flex flex-col">
          <View className="flex flex-row">
            <ChevronLeftIcon
              size={20}
              color={"white"}
              onPress={() => router.replace("/app/home")}
            />
          </View>
          <View className="flex flex-col gap-6 mt-12">
            {Elements.map((element, index) => (
              <Pressable
                onPress={() => router.replace(element.href)}
                key={index}
                className="flex flex-row px-1 py-2 rounded-lg border-gray-700 border-[1.5px] items-center"
              >
                {element.icon}
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text className="text-white font-medium text-lg">
                    {element.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Add;
