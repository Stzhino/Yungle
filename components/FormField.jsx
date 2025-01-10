import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import icons from '../constants/icons'


const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
    const [showPassword, setshowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-400 font-pmedium">{title}</Text>
      <View className="border-2 border-black-100 w-full h-16 px-4 bg-secondary rounded-xl items-center flex flex-row ">
        <TextInput 
            className="flex-1 text-white font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry = {title==='Password' && !showPassword}
        />

        {title==='Password' && (
            <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
                <Image source={!showPassword ? icons.eye : icons.eyehide} className="w-6 h-6" resizeMode='contain'/>
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField