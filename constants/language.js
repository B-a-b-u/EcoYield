import { I18n } from 'i18n-js';
import {en} from './en'
import {tamil} from './tamil'

const translations = {
  en: en,
  ta: tamil,
};
const i18n = new I18n(translations);
i18n.enableFallback = true;
export default i18n;