import { showToast } from '@/lib/toastConfig';
import React from 'react';
import { Pressable, Image } from 'react-native';


export default function MetaOauth() {

    return (

        <Pressable className='rounded-lg bg-gray-900 shadow-sm py-3 px-3' onPress={() => {
            showToast("Not Available", "This login provider is WIP.");
        }}>
            <Image source={require('assets/images/meta1.png')} className='w-9 h-9' />
        </Pressable>

    );
}
