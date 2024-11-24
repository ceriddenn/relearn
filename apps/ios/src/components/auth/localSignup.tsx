import { LockKeyholeIcon, MailIcon, UserIcon } from "lucide-react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Input } from "../input";
import { Pulse } from "react-native-animated-spinkit";
import axios from "axios";
import {
  ServerLocalIdentifierAvailableReturnPolicy,
  ServerValidateTokenResponse,
} from "@/types/policies/authPolicies";
import { showToast } from "@/lib/toastConfig";
import { Checkbox } from "../checkbox";
import { getFirstWord } from "@/lib/utils";
import { AuthContext } from "@/context/AuthContext";
const LocalAuthSignup = () => {
  const { signIn } = useContext(AuthContext);

  const debounceTimeoutRefEmail = useRef(null);
  const controllerRefEmail = useRef(null);

  let nameTimeout: NodeJS.Timeout | undefined;

  const [email, setEmail] = useState<string>();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [nameLabel, setNameLabel] = useState<string | null>();
  const [nameWaiting, setNameWaiting] = useState<boolean>(false);

  const [password, setPassword] = useState<string>();
  const [passwordStrength, setPasswordStrength] = useState<1 | 2 | 3 | null>(
    null,
  );

  const [waiting, setWaiting] = useState<boolean>(false);
  const [tos, setTos] = useState<boolean>(false);

  const [emailAvailableLoading, setEmailAvailableLoading] =
    useState<boolean>(false);

  const fetchEmailIdentifier = async (email: string) => {
    if (controllerRefEmail.current) {
      controllerRefEmail.current.abort();
    }

    // Create a new AbortController for this request
    controllerRefEmail.current = new AbortController();

    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/local/identifier/available`,
        {
          email,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      const {
        isAvailable,
        isValid,
      }: ServerLocalIdentifierAvailableReturnPolicy = await response.data;

      if (!isAvailable) return setEmailError("This email is not available.");
      if (!isValid) return setEmailError("This email is not valid.");
      setEmailSuccess(true);
    } finally {
      setEmailAvailableLoading(false);
    }
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
    if (debounceTimeoutRefEmail.current) {
      clearTimeout(debounceTimeoutRefEmail.current);
    }

    setEmailError(null);
    setEmailSuccess(false);
    setEmailAvailableLoading(true);

    debounceTimeoutRefEmail.current = setTimeout(() => {
      fetchEmailIdentifier(email);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRefEmail.current) {
        clearTimeout(debounceTimeoutRefEmail.current);
      }
      if (controllerRefEmail.current) {
        controllerRefEmail.current.abort();
      }
    };
  }, []);

  const handleNameChange = (name: string) => {
    setName(name);
    setNameWaiting(true);
    if (nameTimeout) {
      clearTimeout(nameTimeout);
    }
    setNameLabel(null);
    const firstName = getFirstWord(name);

    // Set a new timeout to trigger the function after user stops typing
    nameTimeout = setTimeout(() => {
      if (name.length > 0) {
        setNameLabel(`Hey ${firstName}!`);
      } else setNameLabel(null);
      setNameWaiting(false);
    }, 1000);
  };

  const handlePasswordChange = (password: string) => {
    // Update strength state

    // If the password is an empty string
    if (password.length === 0) {
      setPasswordStrength(null);
      return;
    }

    // If the password is less than 5 characters
    if (password.length < 5) {
      setPasswordStrength(1);
    }
    // If the password is between 5 and 8 characters
    else if (password.length >= 5 && password.length <= 8) {
      setPasswordStrength(2);
    }
    // If the password is between 9 and 10 characters
    else if (password.length > 8 && password.length <= 10) {
      setPasswordStrength(2);
    }
    // If the password is more than 10 characters
    else if (password.length > 10) {
      setPasswordStrength(3);
    }

    // Update the password state
    setPassword(password);
  };

  const onSignupPress = async () => {
    setWaiting(true);
    try {
      const backendResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/local/signup`,
        {
          email: email,
          name: name,
          password: password,
          tos: tos,
        },
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (backendResponse) {
        const data = await backendResponse.data;
        const { jwtToken, refreshToken }: ServerValidateTokenResponse = data;
        await signIn(jwtToken, refreshToken);

        showToast("Success", "Authentication successful.", "success");
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
      <View className="flex mt-6 gap-6">
        <View className="flex gap-2">
          <View className="flex-row gap-1 items-center">
            <Text className="font-semibold text-md text-white">Name</Text>
            <View className="right-0 ml-auto flex-row items-center">
              {nameWaiting && <Pulse size={25} color="#ff8fab" />}
              {nameLabel && !nameWaiting && (
                <Text className="font-medium text-md text-green-500">
                  {nameLabel}
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row items-center px-4 py-1 border-[1.5px] border-gray-600 rounded-lg gap-3 ">
            <UserIcon color="#4b5563" size={25} />
            <Input
              onChangeText={(name) => handleNameChange(name)}
              placeholder="Enter your full name"
              className="w-full pr-12"
            />
          </View>
        </View>
        <View className="flex gap-2">
          <View className="flex-row gap-1 items-center">
            <Text className="font-semibold text-md text-white">Email</Text>
            <View className="right-0 ml-auto flex-row items-center">
              {emailAvailableLoading && <Pulse size={25} color="#ff8fab" />}
              {emailError != null && (
                <Text className="font-medium text-md text-red-500">
                  {emailError}
                </Text>
              )}
              {emailSuccess && (
                <Text className="font-medium text-md text-green-500">
                  Looking good!
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row items-center px-4 py-1 border-[1.5px] border-gray-600 rounded-lg gap-3 ">
            <MailIcon color="#4b5563" size={25} />
            <Input
              onChangeText={(email) => handleEmailChange(email)}
              placeholder="Enter your email"
              className="w-full pr-12"
            />
          </View>
        </View>
        <View className="flex gap-2">
          <Text className="font-semibold text-md text-white">Password</Text>

          <View className="flex-row items-center px-4 py-1 border-[1.5px] border-gray-600 rounded-lg gap-3 ">
            <LockKeyholeIcon
              size={25}
              color={
                passwordStrength === null
                  ? "#4b5563"
                  : passwordStrength === 1
                    ? "#ef4444"
                    : passwordStrength === 2
                      ? "#eab308"
                      : passwordStrength === 3
                        ? "#22c55e"
                        : "#4b5563" // Default color
              }
            />
            <Input
              onChangeText={(password) => handlePasswordChange(password)}
              placeholder="********"
              secureTextEntry={true}
              className="w-full pr-12"
            />
          </View>
        </View>
      </View>
      <View className="flex flex-row justify-between mt-5">
        <View className="flex flex-row gap-2 items-center">
          <Checkbox
            checked={tos}
            onCheckedChange={setTos}
            className="text-white"
          />
          <Text className="font-medium text-md text-gray-400">
            I accept the TOS
          </Text>
        </View>
        {/*<Text className='font-medium text-md text-blue-600 '>Forgot password</Text>*/}
      </View>
      <View className="mt-12">
        <Pressable
          onPress={onSignupPress}
          className="border-[1.5px] rounded-lg bg-[#ff8fab] border-[#ff8fab] items-center py-2"
        >
          {waiting ? (
            <ActivityIndicator size={"small"} className="text-white" />
          ) : (
            <Text className="text-white font-medium text-lg">Sign Up</Text>
          )}
        </Pressable>
      </View>
    </>
  );
};

export default LocalAuthSignup;
