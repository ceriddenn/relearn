import { Input } from "@/components/input";
import { AuthContext } from "@/context/AuthContext";
import { showToast } from "@/lib/toastConfig";
import { Account as AccountType } from "@prisma/client";
import axios from "axios";
import Modal from "react-native-modal";

import { usePathname, useRouter } from "expo-router";
import {
  ArrowRightCircleIcon,
  AtSignIcon,
  CheckIcon,
  PencilRulerIcon,
  XIcon,
} from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const Account = () => {
  const pathName = usePathname();
  const router = useRouter();

  const { user, jwtToken, signOut, updateUserState } = useContext(AuthContext);

  const [waiting, setWaiting] = useState<boolean>(false);
  const [accountState, setAccountState] = useState<AccountType | null>();

  const [editNameModal, setEditNameModal] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");

  const opacityUpdateButton = useSharedValue(1); // Start fully transparent

  const animatedStyleUpdateButton = useAnimatedStyle(() => {
    return {
      opacity: opacityUpdateButton.value,
    };
  });

  useEffect(() => {
    async function getAccount() {
      setWaiting(true);
      const request = await axios.get(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/user/account`,
        { headers: { Authorization: `Bearer ${jwtToken}` } },
      );

      const data = await request.data;
      setAccountState(data.account);
      setWaiting(false);
    }
    getAccount();
    opacityUpdateButton.value = 0;
    setUsername("");
  }, [pathName]);

  const handleUsernameInputChange = (v: string) => {
    setUsername(v);
    opacityUpdateButton.value = withTiming(0, { duration: 0 });

    setTimeout(() => {
      opacityUpdateButton.value = withTiming(1, { duration: 500 });
    }, 0);
  };

  const handleUpdateButtonPress = async () => {
    try {
      setWaiting(true);
      await axios.post(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/user/username`,
        { username: username },
        { headers: { Authorization: `Bearer ${jwtToken}` } },
      );
      await updateUserState();

      showToast("Success", "Updated your username", "success");
      setUsername("");
      setWaiting(false);
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
      setWaiting(false);
    }
  };

  const handleEditNameX = () => {
    setWaiting(false);
    setEditNameModal(false);
  };

  const handleEditNamePress = async () => {
    try {
      setWaiting(true);
      await axios.post(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/user/name`,
        { name: name },
        { headers: { Authorization: `Bearer ${jwtToken}` } },
      );
      await updateUserState();

      showToast("Success", "Updated your name", "success");
      setName("");
      setWaiting(false);
      setEditNameModal(false);
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
      setWaiting(false);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback>
        <View className="flex h-screen bg-black px-6">
          <View className="flex items-center mt-12">
            <Image
              src={
                "https://lh3.googleusercontent.com/a/ACg8ocIQJpKTdwshXXy_-tMwrH14LmZ6hgxCosrZ8Mo0RdF32cBpgw=s96-c"
              }
              className="rounded-xl h-24 w-24"
            />
            <View className="flex flex-row items-center justify-center my-6 gap-6">
              <View className="flex mt-1">
                <Text className="text-white font-semibold text-3xl">
                  {user.name}
                </Text>
              </View>
              <Pressable
                className="flex flex-row gap-1 bg-white rounded-lg p-2 items-center"
                onPress={() => setEditNameModal(!editNameModal)}
              >
                <Text className="flex text-md font-semibold text-black">
                  Edit
                </Text>
                <PencilRulerIcon size={12} color={"black"} />
              </Pressable>
            </View>
          </View>
          <Pressable
            onPress={() => {
              signOut();
              router.replace("/signIn");
            }}
            className="border-[1.5px] rounded-lg bg-[#ff8fab] border-[#ff8fab] items-center py-2 bottom-0"
          >
            <Text className="text-white font-medium text-lg">Sign Out</Text>
          </Pressable>

          <View className="bg-gray-700 rounded-2xl w-full p-[0.5] my-6"></View>
          <View className="flex gap-2">
            <Text className="font-semibold text-md text-white">Username</Text>

            <View className="flex-row items-center px-4 py-1 border-[1.5px] border-gray-600 rounded-lg gap-3 ">
              <AtSignIcon color="#4b5563" size={25} />
              <Input
                placeholder={user.username}
                className="w-full pr-12"
                value={username}
                onChangeText={(newUN) => handleUsernameInputChange(newUN)}
              />
            </View>
          </View>

          {accountState && accountState.loginSolution == "LOCAL" && (
            <View className="flex mt-6">
              <Pressable
                onPress={() => {}}
                className=" border-[1.5px] rounded-lg bg-[#7C73E6] items-center py-2 bottom-0"
              >
                <View className="flex flex-row w-full items-center">
                  <Text className="text-white font-medium text-lg mr-auto ml-3">
                    Reset Password
                  </Text>
                  <ArrowRightCircleIcon
                    size={20}
                    color={"white"}
                    style={{ marginRight: 10 }}
                    className="ml-auto"
                  />
                </View>
              </Pressable>
            </View>
          )}
          {username.length > 0 && (
            <Animated.View style={[animatedStyleUpdateButton]}>
              <Pressable
                onPress={() => handleUpdateButtonPress()}
                className="mt-12 border-[1.5px] rounded-lg bg-black border-[#ff8fab] items-center py-2 bottom-0"
              >
                {waiting ? (
                  <ActivityIndicator size={"small"} color={"white"} />
                ) : (
                  <Text className="text-white font-medium text-lg">Update</Text>
                )}
              </Pressable>
            </Animated.View>
          )}
          <View>
            <Modal isVisible={editNameModal}>
              <View className="flex w-full p-4 bg-white rounded-lg gap-2">
                <View className="flex flex-row items-center">
                  <Text className="text-black font-semibold text-xl">
                    Edit My Name
                  </Text>
                  <XIcon
                    size={20}
                    color={"black"}
                    onPress={() => handleEditNameX()}
                    style={{ marginLeft: "auto" }}
                  />
                </View>
                <Input
                  placeholder={user.name}
                  className="w-full pr-12 border-black border-[1.5px] rounded-lg px-3 text-black"
                  value={name}
                  onChangeText={(newName) => setName(newName)}
                />
                <View className="mt-3">
                  <Pressable
                    className="border-[1.5px] rounded-lg bg-[#ff8fab] border-[#ff8fab] items-center py-2 bottom-0 flex flex-row justify-center"
                    onPress={() => handleEditNamePress()}
                  >
                    {waiting ? (
                      <ActivityIndicator size={"small"} color={"white"} />
                    ) : (
                      <>
                        <Text className="text-white font-medium text-lg">
                          Edit
                        </Text>
                        <CheckIcon
                          size={18}
                          color={"white"}
                          style={{ marginLeft: 5 }}
                        />
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Account;
