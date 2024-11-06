import React from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'

const Account = () => {
    return (
        <TouchableWithoutFeedback >
            <View className='flex h-screen bg-black'>
                <Text className='text-white'>Account Page</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Account