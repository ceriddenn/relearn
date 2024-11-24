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
import GoogleOauth from "@/components/auth/google";
import MetaOauth from "@/components/auth/meta";
import LocalAuthSignup from "@/components/auth/localSignup";

const SignUp = () => {
  // sign up state

  // view state

  // other state
  const router = useRouter();

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex h-screen bg-black justify-center items-center my-auto">
          <View className="flex px-6 w-full">
            <View className="flex flex-col space-y-3">
              <Text className="font-medium text-4xl text-white">
                Sign Up ✨
              </Text>
              <Text className="text-xl text-gray-400">
                To get started, create an account.
              </Text>
            </View>
            <LocalAuthSignup />

            <View className="mt-4 flex items-center">
              <Text className="text-gray-600 font-medium text-md">
                ------- Or sign up with -------
              </Text>
            </View>

            <View className="flex flex-row mt-4 justify-evenly items-center">
              <Pressable className="rounded-lg bg-gray-900 shadow-sm py-3 px-3">
                <PhoneIcon color={"white"} width={30} height={30} />
              </Pressable>
              <GoogleOauth />
              <MetaOauth />
            </View>

            <View className="flex mt-12 mx-auto flex flex-row">
              <Text className="text-xl text-gray-400">
                Already have an account?&nbsp;
              </Text>
              <Text
                className="text-xl text-blue-600"
                onPress={() => router.push("/signIn")}
              >
                Sign In
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default SignUp;
