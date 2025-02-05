import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React, {useState} from 'react'
import icons from '../constants/icons'
import { router, usePathname } from 'expo-router'


const SearchInput = ({initialQuery}) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');
  return (
      <View className="w-full h-16 px-4 bg-gray-200 rounded-3xl items-center flex flex-row space-x-4">
        <TouchableOpacity 
            onPress={()=>{
                if(!query){
                    return Alert.alert('Missing query', "Please input a name to search for a result")
                }

                if(pathname.startsWith('/search')){
                    router.setParams({query})
                }
                else{
                    router.push(`/search/${query}`)
                }
            }}
        >
            <Image
                source = {icons.search}
                className='w-6 h-6'
                resizeMode='contain'
            />
        </TouchableOpacity>
        <TextInput 
            className="text-base mt-0.5 ml-4 text-black flex-1 font-pregular"
            value={query}
            placeholder="Search"
            placeholderTextColor="#7b7b8b"
            onChangeText={(e)=>setQuery(e)}
        />
        <TouchableOpacity>
            <Image
                source = {icons.filter}
                className='w-6 h-6'
                resizeMode='contain'
            />
        </TouchableOpacity>
      </View>
  )
}

export default SearchInput
