import React, { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { List, MD3Theme, Text } from "react-native-paper";
import { i18n, locales } from '../library/i18n';
import { ThemeMode } from '../library/themeMode';
import { ScrollView } from 'react-native-gesture-handler';
import LocaleSwitch from './LocaleSwitch';
import { Site } from '../site';

interface SettingsProps {
    theme: MD3Theme,
    saveTheme: (mode: ThemeMode) => Promise<void>;
}

export default function Settings({ theme, saveTheme }: SettingsProps) {
    const [locvis, setLocvis] = useState<boolean>(false);
    
    const changeTheme = (dark: boolean) => {
        saveTheme(dark ? "dark" : 'system');
    }

    const openLocaleMenu = () => {
        setLocvis(true);
    }

    return (
        <View style={style.page}>
            <ScrollView style={{...style.sv}}>
                <List.Section>
                    <List.Subheader style={{ opacity: 0.5 }}>{i18n.t("MENU.APP")}</List.Subheader>
                    <List.Item
                        titleStyle={style.menuItemTitleStyle}
                        style={style.menuItemStyle}
                        title={i18n.t(`THEME.${theme.dark ? 'dark' : 'light'}`)}
                        onPress={() => changeTheme(!theme.dark)}
                        left={props => <List.Icon {...props} icon={theme.dark ? 'weather-night' : 'weather-sunny'} />}
                    />
                    <List.Item
                        titleStyle={style.menuItemTitleStyle}
                        style={style.menuItemStyle}
                        title={i18n.t('LANG', { lang: locales.find(l => l.code == i18n.locale)?.label })}
                        onPress={openLocaleMenu}
                        left={props => <List.Icon {...props} icon="translate" />}
                    />
                </List.Section>
                <View style={{...style.aboutView}}>
                    <Text variant='bodySmall' style={{opacity: 0.5}}>{Site.BRAND} v{Site.VERSION} &copy; {Site.RELEASE_YEAR}</Text>
                    {Site.DEVELOPER && <Text variant='bodySmall' style={{opacity: 0.5}}>{i18n.t("DEV", {dev: Site.DEVELOPER})}</Text>}
                </View>
            </ScrollView>
            <LocaleSwitch locvis={locvis} setLocvis={setLocvis} theme={theme}/>
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
    menuItemStyle: {
        marginVertical: 10
    },
    menuItemTitleStyle: {
        fontSize: 18,
    },
    aboutView: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    }
})