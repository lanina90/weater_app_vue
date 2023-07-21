import { createI18n } from "vue-i18n";
import {messages} from "@/i18n/localization";


export default createI18n({
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'uk',
  legacy: false,
  messages
})