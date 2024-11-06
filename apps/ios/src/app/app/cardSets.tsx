import React from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'

const CardSets = () => {
    return (
        <TouchableWithoutFeedback >
            <View className='flex px-6 w-full h-screen bg-black'>
                <View className='flex flex-col space-y-3 mt-12'>
                    <Text className='font-medium text-4xl text-white'>My Card Sets</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default CardSets