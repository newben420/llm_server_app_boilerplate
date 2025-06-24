import React from 'react';
import { StyleSheet, View } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { MD3Theme, Text } from "react-native-paper";

interface HomeProps {
    theme: MD3Theme,
}

export default function Home({ theme }: HomeProps) {
    return (
        <View style={{ ...style.page }}>
            <ScrollView style={{ ...style.sv }}>

            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    page: {
        ...StyleSheet.absoluteFillObject,
    },
    sv: {
        flex: 1,
        width: '100%',
        padding: 10,
    },
})