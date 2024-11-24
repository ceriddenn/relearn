import { Input } from '@/components/input'
import axiosInstance from '@/lib/401Interceptor'
import { showToast } from '@/lib/toastConfig'
import { useRouter } from 'expo-router'
import { ArrowRightCircleIcon, AtSignIcon } from 'lucide-react-native'
import React, { useState } from 'react'
import { Keyboard, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native'

const CompleteSignup = () => {

    const router = useRouter();
    const [username, setUsername] = useState<string>("");

    const handleContinueAppPress = async () => {
        try {
            const response = await axiosInstance.post(`${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/local/complete-signup`, {
                username: username,
            }, {
                headers: { "Content-Type": "application/json" },
            })

            const data = await response.data;

            if (data && data.status == 200) {
                showToast("Welcome!", "Your account setup has been completed.", "success");
                router.replace('/app/home');
            }

        } catch (error) {
            showToast("Oops!", error.response.data.message, "error")

        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View className='flex px-6 w-full h-screen'>
                <View className='flex flex-col space-y-3 mt-12'>
                    <Text className='font-medium text-4xl text-white'>Finish Signup</Text>
                    <Text className='text-xl text-gray-400'>Enter a username for your account below.</Text>
                </View>
                <View className='flex gap-2 mt-6'>
                    <Text className='font-semibold text-md text-white'>Username</Text>

                    <View className="flex-row items-center px-4 py-1 border-[1.5px] border-gray-600 rounded-lg gap-3 ">
                        <AtSignIcon color="#4b5563" size={25} />
                        <Input
                            onChangeText={(username) => setUsername(username)}
                            placeholder='therealsnoop'
                            className='w-full pr-12'
                        />
                    </View>

                </View>
                <Pressable
                    onPress={() => handleContinueAppPress()}
                    className='mt-8 border-[1.5px] rounded-lg bg-[#ff8fab] border-[#ff8fab] items-center py-2'>
                    <View className='flex flex-row w-full px-4 items-center'>
                        <Text className='text-white font-medium text-lg left-0 mr-auto'>Continue to App</Text>
                        <ArrowRightCircleIcon color={'white'} size={25} />

                    </View>
                </Pressable>
            </View>

        </TouchableWithoutFeedback>
    )
}

export default CompleteSignup