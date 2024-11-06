import React, { useContext, useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import { AuthContext } from '@/context/AuthContext'
import axiosInstance from '@/lib/401Interceptor'
const Home = () => {

    const { signOut, jwtToken, user, updateUserState } = useContext(AuthContext);
    const [userData, setUserData] = useState<any | null>(null);
    async function callAPI() {
        setUserData(null);
        const query = await axiosInstance.get(`${process.env.EXPO_PUBLIC_API_SERVER_URL}/user`, {
            headers: { Authorization: `Bearer ${jwtToken}` }
        })
        const data = await query.data;
        setUserData(data.user);
    }

    return (
        <TouchableWithoutFeedback onPress={() => updateUserState()}>
            <View className='flex h-screen bg-black'>
                <Text className='text-white text-2xl font-semibold' onPress={signOut}>Dashboard</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Home