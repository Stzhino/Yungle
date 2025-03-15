import React from "react";
import { SafeAreaView, ScrollView, Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const KeyboardMover = ({ children }) => {
    return (
        <SafeAreaView className="bg-black h-full">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        {children}
                    </ScrollView>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default KeyboardMover;
