# 007 — Add Localization Foundation

## Goal

Establish minimal English and Turkish localization support for the EDUSPHERE application.

## Scope

* Add localization support compatible with the Next.js App Router.
* Define English and Turkish as supported locales.
* Set English as the default locale.
* Create translation files for both locales.
* Display the home page heading using a translation key.

## Out of Scope

* Language selector
* Locale-specific URL routing
* User language preferences
* Database-stored translations
* Localized validation errors
* Date, time, and number formatting
* Translating business content

## Requirements

* The application supports `en` and `tr` locale identifiers.
* English and Turkish translation files use the same translation keys.
* The home page heading is retrieved from the translation system.
* No hard-coded duplicate locale logic is introduced.
* No business functionality is added.

## Acceptance Criteria

* The English home page heading renders from the English translation file.
* The Turkish equivalent exists in the Turkish translation file.
* Missing or mismatched translation keys cause a detectable development error.
* The development server runs successfully.
* The production build completes successfully.
* No language-switching interface is implemented.