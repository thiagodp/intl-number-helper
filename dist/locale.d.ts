/**
 * Returns the currency code from a given locale with country code or `null` if not found.
 * Whether the locale does not have a country code, it returns `null`.
 *
 * @example
 *  - 'en-US' -> 'USD'
 *  - 'de' -> null
 *  - 'pt-BR' -> 'BRL'
 *  - '?' -> null
 *
 * @param locale Locale
 */
export declare function currencyFromLocale(locale: string): string | null;
/**
 * Returns the country code from a locale or `null` if not defined.
 *
 * @example
 *  - 'en-US'       -> 'US'
 *  - 'zh-Hans-CN'  -> 'CN'
 *  - 'en'          -> null
 *  - '?'           -> null
 *
 * @param locale Locale
 */
export declare function extractCountryCode(locale: string): string | null;
