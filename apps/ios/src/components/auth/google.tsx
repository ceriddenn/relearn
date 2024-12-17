import React, { useContext, useEffect } from "react";
import { Platform, Pressable, Image } from "react-native";
import * as AuthSession from "expo-auth-session";
import axios from "axios";
import { showToast } from "@/lib/toastConfig";
import { AuthContext } from "@/context/AuthContext";
import { ServerValidateTokenResponse } from "@/types/policies/authPolicies";
const CLIENT_IDS = {
  ios: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
};

const redirectUri = `${process.env.EXPO_PUBLIC_REDIRECT_SCHEME}:/oauth2redirect/google`;

export default function GoogleOauth() {
  const { signIn } = useContext(AuthContext);

  const discovery = AuthSession.useAutoDiscovery("https://accounts.google.com");

  const clientId = Platform.select({
    ios: CLIENT_IDS.ios,
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ["email", "profile", "openid"],
      redirectUri,
      responseType: "code",
      usePKCE: true, // Enable PKCE
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      (async () => {
        try {
          // Exchange the authorization code for tokens
          const tokenResponse = await AuthSession.exchangeCodeAsync(
            {
              clientId,
              code,
              redirectUri,
              extraParams: {
                code_verifier: request.codeVerifier,
              },
            },
            discovery,
          );

          // Fetch user information from Google
          const backendResponse = await axios.post(
            `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/google`,
            JSON.stringify({
              idToken: tokenResponse.idToken,
              accessToken: tokenResponse.accessToken,
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
          if (backendResponse) {
            const data = await backendResponse.data;
            const { jwtToken, refreshToken }: ServerValidateTokenResponse =
              data;
            await signIn(jwtToken, refreshToken);
          } else {
            await backendResponse.data;
            showToast("Error", "Please try again.");
          }
        } catch (error) {
          showToast("Error", error.response.data.message);
        }
      })();
    } else if (response?.type === "error") {
      showToast("Authentication error:", response.error.message);
    }
  }, [response]);

  return (
    <Pressable
      className="rounded-lg bg-gray-900 shadow-sm py-3 px-3"
      disabled={!request}
      onPress={() => {
        promptAsync();
      }}
    >
      <Image
        source={require("assets/images/google1.png")}
        className="w-9 h-9"
      />
    </Pressable>
  );
}
