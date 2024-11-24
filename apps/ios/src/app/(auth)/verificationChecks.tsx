import { AuthContext } from "@/context/AuthContext";
import axiosInstance from "@/lib/401Interceptor";
import { showToast } from "@/lib/toastConfig";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";

const VerificationChecks = () => {
  const router = useRouter();

  const { passedPreflight } = useContext(AuthContext);

  const pinCodeRef = useRef<OtpInputRef>();

  const [loading, setLoading] = useState<boolean>(false);

  const [code, setCode] = useState<string>("");
  const [method, setMethod] = useState<"EMAIL" | "SMS">("EMAIL");

  useEffect(() => {
    if (!passedPreflight) return;
    /// if (passedPreflight.passed) return router.push("completeSignup");
    // since user needs to verify a contact method, we ask
    // the server to go ahead and send the code.

    // contact server, send with the method

    if (passedPreflight.message.includes("email")) {
      setMethod("EMAIL");
    } else setMethod("SMS");
  }, [passedPreflight]);

  const onPressVerifyEmail = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/local/identifier/verify`,
        {
          code: code,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.data;

      if (data && data.status == 200) {
        showToast(
          "Verified!",
          "We just verified your account. Redirecting...",
          "success",
        );
        router.replace("completeSignup");
      }
    } catch (error) {
      showToast("Oops!", error.response.data.message, "error");
      if (pinCodeRef.current) {
        pinCodeRef.current.clear();
      }
    }
    setLoading(false);
    // send to complete signup after this flow
  };

  const onPressVerifySMS = () => {
    // send to complete signup after this flow
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex px-6 w-full h-screen">
        {method == "EMAIL" && (
          <>
            <View className="flex flex-col space-y-3 mt-12">
              <Text className="font-medium text-4xl text-white">
                Verify Email
              </Text>
              <Text className="text-xl text-gray-400">
                To continue, enter the code sent to your email.
              </Text>
            </View>
            <OtpInput
              numberOfDigits={6}
              onTextChange={(text) => setCode(text)}
              ref={pinCodeRef}
              disabled={loading}
              focusColor={"#ff8fab"}
              theme={{
                containerStyle: {
                  marginTop: 24,
                  justifyContent: "space-around",
                  gap: 0,
                },
                pinCodeTextStyle: { color: "white" },
              }}
            />

            <Pressable
              onPress={onPressVerifyEmail}
              className="mt-8 border-[1.5px] rounded-lg bg-[#ff8fab] border-[#ff8fab] items-center py-2"
            >
              {loading ? (
                <ActivityIndicator size={"small"} className="text-white" />
              ) : (
                <Text className="text-white font-medium text-lg">Verify</Text>
              )}
            </Pressable>
          </>
        )}

        {method == "SMS" && (
          <>
            <View className="flex flex-col space-y-3 mt-12">
              <Text className="font-medium text-4xl text-white">
                Verify Phone
              </Text>
              <Text className="text-xl text-gray-400">
                To continue, enter the code sent to your phone.
              </Text>
            </View>
            <OtpInput
              numberOfDigits={6}
              onTextChange={(text) => console.log(text)}
              focusColor={"#ff8fab"}
              theme={{
                containerStyle: {
                  marginTop: 24,
                  justifyContent: "space-around",
                  gap: 0,
                },
                pinCodeTextStyle: { color: "white" },
              }}
            />

            <Pressable
              onPress={onPressVerifySMS}
              className="mt-8 border-[1.5px] rounded-lg bg-[#ff8fab] border-[#ff8fab] items-center py-2"
            >
              <Text className="text-white font-medium text-lg">
                Verify Phone
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VerificationChecks;
