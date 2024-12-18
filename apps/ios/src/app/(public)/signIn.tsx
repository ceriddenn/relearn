import React from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { PhoneIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import LocalAuthSignin from "@/components/auth/localSignin";
import GoogleOauth from "@/components/auth/google";
const SignIn = () => {
  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex h-screen bg-black ">
        <View className="flex px-6 w-full">
          <LocalAuthSignin />

          <View className="flex items-center mt-4">
            <Text className="text-gray-600 font-medium text-md">
              ------- Or log in with -------
            </Text>
          </View>

          <View className="flex flex-row mt-4 justify-evenly items-center">
            {/* <Pressable className="rounded-lg bg-gray-900 shadow-sm py-3 px-3">
              <PhoneIcon color={"white"} width={30} height={30} />
            </Pressable> */}
            <GoogleOauth />
          </View>

          <View className="flex mt-12 mx-auto flex flex-row">
            <Text className="text-xl text-gray-400">
              Don't have an account?&nbsp;
            </Text>
            <Text
              className="text-xl text-blue-600"
              onPress={() => router.push("/signUp")}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
