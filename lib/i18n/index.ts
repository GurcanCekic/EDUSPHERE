import en from "./messages/en.json";
import tr from "./messages/tr.json";
import { defaultLocale, type Locale } from "./locales";

export type Messages = typeof en;

// Typing `tr` against the English shape makes a missing or mismatched
// translation key a type error during development.
const messages: Record<Locale, Messages> = {
  en,
  tr,
};

export function getMessages(locale: Locale = defaultLocale): Messages {
  return messages[locale];
}
