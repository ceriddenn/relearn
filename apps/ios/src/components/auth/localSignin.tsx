import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  View,
} from "react-native";
import { LockKeyholeIcon, MailIcon } from "lucide-react-native";
import { Input } from "../input";
import { showToast } from "@/lib/toastConfig";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { ServerValidateTokenResponse } from "@/types/policies/authPolicies";

const LocalAuthSignin = () => {
  const { signIn } = useContext(AuthContext);

  const [waiting, setWaiting] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSigninPress = async () => {
    // close the keyboard if an input element is still in focus.
    Keyboard.dismiss();
    setWaiting(true);
    // do signin stuff
    try {
      const backendResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/local/authenticate`,
        {
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (backendResponse) {
        const data = await backendResponse.data;
        const { jwtToken, refreshToken }: ServerValidateTokenResponse = data;
        await signIn(jwtToken, refreshToken);

        showToast("Success", "Login successful! Redirecting...", "success");
      } else {
        await backendResponse.data;
        showToast("Error", "Please try again.");
      }
    } catch (error) {
      const msg = error.response.data.message;
      showToast("Error", msg, "error");
    }
    setWaiting(false);
  };

  return (
    <>
      <View className="flex flex-col space-y-3 mt-24">
        <Text className="font-medium text-4xl text-white">Sign in ✨</Text>
        <Text className="text-xl text-gray-400">
          Welcome back! Please login.
        </Text>
      </View>
      <View className="flex mt-6 gap-6">
        <View className="flex gap-2">
          <Text className="font-semibold text-md text-white">Email</Text>

          <View className="flex-row items-center px-4 py-1 border-[1.5px] border-gray-600 rounded-lg gap-3 ">
            <MailIcon color="#4b5563" size={25} />
            <Input
              onChangeText={(email) => setEmail(email)}
              placeholder="Enter your email"
              className="w-full pr-12"
            />
          </View>
        </View>
        <View className="flex gap-2">
          <Text className="font-semibold text-md text-white">Password</Text>

          <View className="flex-row items-center px-4 py-1 border-[1.5px] border-gray-600 rounded-lg gap-3 ">
            <LockKeyholeIcon color="#4b5563" size={25} />
            <Input
              onChangeText={(password) => setPassword(password)}
              placeholder="********"
              secureTextEntry={true}
              className="w-full pr-12"
            />
          </View>
        </View>
      </View>
      <View className="flex flex-row justify-between mt-5">
        <Text className="font-medium text-md text-blue-600 ">
          Forgot password
        </Text>
      </View>
      <View className="mt-12">
        <Pressable
          className="border-[1.5px] rounded-lg bg-[#ff8fab] border-[#ff8fab] items-center py-2"
          onPress={() => handleSigninPress()}
        >
          {waiting ? (
            <ActivityIndicator size={"small"} className="text-white" />
          ) : (
            <Text className="text-white font-medium text-lg">Sign In</Text>
          )}
        </Pressable>
      </View>
    </>
  );
};

export default LocalAuthSignin;
