interface NumberFormatOptions {
    style?: 'decimal' | 'percent' | 'unit' | 'currency';
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
    compactDisplay?: 'long' | 'short';
    currency?: string;
    currencyDisplay?: 'symbol' | 'narrowSymbol' | 'name' | 'code';
    currencySign?: 'standard' | 'accounting';
    signDisplay?: 'auto' | 'always' | 'exceptZero' | 'never';
    useGrouping?: boolean;
    minimumIntegerDigits?: number;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
}
/**
 * Indicates if the given pattern is correct.
 *
 * @param pattern Pattern
 */
export declare function isPatternCorrect(pattern: string): boolean;
/**
 * Generates a configuration for `Intl.NumberFormat` from the given pattern.
 *
 * @see readme.md for documentation about the pattern.
 *
 * @param pattern Pattern to transform.
 * @param additionalOptions Additional options to be copied to the resulting object.
 */
export declare function makeOptions(pattern: string, additionalOptions?: NumberFormatOptions): NumberFormatOptions;
/**
 * Formats a number.
 *
 * @param value Value to be formatted.
 * @param locale Locale. When `pattern` uses currency, it guesses the currency
 *  from the country code. When the locale does not have a country code and
 *  `additionalOptions` does not define a currency, the currency fallbacks
 *  to `"USD"`.
 * @param pattern Pattern. Optional. By default, itt generates an empty
 *  options object by default.
 * @param additionalOptions Options to be added to those generated from
 *  the pattern. Optional. Useful for units.
 *
 * @throws `Error` when `pattern` uses currency and `locale` does not have
 *  a country code.
 */
export declare function formatNumber(value: number, locale?: string, pattern?: string, additionalOptions?: NumberFormatOptions): string;
export {};
