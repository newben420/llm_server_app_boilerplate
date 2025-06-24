import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './../locales/en.json';

export const locales = [
    {code: 'en', label: 'English'},
]

const i18 = new I18n({ 
    en,
});

const deviceLanguage = getLocales()[0].languageCode || locales[0].code;

i18.locale = deviceLanguage;
i18.enableFallback = true;

export const i18n = i18;