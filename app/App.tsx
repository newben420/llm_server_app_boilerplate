import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { dbSetUp } from "./library/db";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { Log } from "./library/log";
import {
  Appbar,
  BottomNavigation,
  Icon,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider, useLocale } from "./components/LocaleContext";
import { Site } from "./site";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "./library/storageKeys";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeMode } from "./library/themeMode";
import { NotifierWrapper } from "react-native-notifier";
import { CustomDarkTheme, CustomLightTheme } from "./library/themes";
SplashScreen.preventAutoHideAsync();
import * as Font from 'expo-font';
import Home from "./components/Home";
import Settings from "./components/Settings";
import { i18n } from "./library/i18n";
import { GET } from "./library/api";
import { getToken } from "./library/token";
import { refreshTokenWithExpoId } from "./library/auth";
import { requestWhenOnline } from "./library/requestWhenOnline";




interface MainAppProps {
  isReady: boolean;
  onLayoutRootView: () => void;
};


function MainApp({ isReady, onLayoutRootView }: MainAppProps) {
  const { locale } = useLocale();
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const isDark = useMemo(() => {
    return themeMode === "system"
      ? systemScheme === "dark"
      : themeMode === "dark";
  }, [themeMode, systemScheme]);

  const theme = useMemo(() => (isDark ? CustomDarkTheme : CustomLightTheme), [isDark]);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(StorageKeys.THEME);
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemeMode(saved);
      }
    })();
  }, [themeMode]);

  const saveTheme = useCallback(
    async (mode: ThemeMode) => {
      setThemeMode(mode);
      await AsyncStorage.setItem(StorageKeys.THEME, mode);
    },
    [setThemeMode]
  );

  const HomeRoute = () => <Home theme={theme} />
  const SettingsRoute = () => <Settings saveTheme={saveTheme} theme={theme} />

  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: 'home', title: Site.BRAND, focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'settings', title: i18n.t("MENU.SETTINGS"), unfocusedIcon: 'cog-outline', focusedIcon: 'cog' },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const ind = parseInt(await AsyncStorage.getItem(StorageKeys.PAGE) || "0");
        if (ind || ind === 0) {
          setIndex(ind);
        }
        if(!(await getToken())){
          requestWhenOnline(async () => await refreshTokenWithExpoId());
        }
      } catch (error) {
        Log.dev(error);
      }
    })();
  }, []);

  const onIndexChange = (index: number) => {
    AsyncStorage.setItem(StorageKeys.PAGE, index.toString());
    setIndex(index);
  }

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    settings: SettingsRoute,
  });

  function renderIcon({route, focused, color}: { route: any; focused: any; color: any }) {
    return (
      <Icon 
        source={focused ? route.focusedIcon : route.unfocusedIcon}
        size={28}
        color={color}
      />
    )
  }

  const currentRoute = routes[index];

  if (!isReady) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <GestureHandlerRootView>
          <NotifierWrapper>
            <PaperProvider theme={theme}>
              <View style={style.container}>
                <Appbar.Header style={{
                  ...style.header,
                  backgroundColor: theme.colors.background
                }} mode="small" elevated={false}>
                  <Appbar.Content titleStyle={{
                    fontWeight: 800,
                    letterSpacing: 1.2,
                  }} title={currentRoute.title} />
                  {/* <Appbar.Action size={30} icon='account-circle' /> */}
                </Appbar.Header>

                <View style={style.flex}>
                  <BottomNavigation
                    shifting={true}
                    labeled={false}
                    compact={false}
                    navigationState={{ index, routes }}
                    onIndexChange={onIndexChange}
                    renderScene={renderScene}
                    renderIcon={renderIcon}
                    barStyle={{
                      backgroundColor: theme.colors.background,
                      elevation: 1,
                      shadowColor: theme.colors.shadow,
                      shadowOffset: { width: 0, height: -1 },
                      shadowRadius: 1,
                      shadowOpacity: 0.1,

                    }}
                    activeIndicatorStyle={{
                      backgroundColor: 'transparent',
                    }}
                  />
                </View>
              </View>
            </PaperProvider>
          </NotifierWrapper>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {

  }
});

export default function App() {
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    const prepareApp = async () => {
      try {
        const start = Date.now();
        // begin setup
        // db setup
        await dbSetUp();
        // font setup
        await Font.loadAsync({
          // 'tertiary': require('./assets/font/Calligraffitti-Regular.ttf'),
        })
        // end setup
        const end = Date.now();
        const duration = end - start;
        if (duration < Site.SPLASH_TIME_MS) {
          await new Promise((r) => setTimeout(r, Site.SPLASH_TIME_MS - duration));
        }
      } catch (error) {
        Log.dev(error);
      } finally {
        setIsReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <LocaleProvider>
      <MainApp isReady={isReady} onLayoutRootView={onLayoutRootView} />
    </LocaleProvider>
  );
}
