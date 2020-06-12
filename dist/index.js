import { currencyFromLocale } from "./locale";
// Try it on https://regex101.com
const regex = /^([$d%u$wnoaEecls])?(?: |\\t)*(\#?)(?: |\\t)*([+!@])?([0-9]{0,2})(?:\.([0-9]{0,2})(?:\-([0-9]{0,2}))?)?(?:\;([0-9]{0,2})(?:\-([0-9]{0,2}))?)?$/;
/**
 * Indicates if the given pattern is correct.
 *
 * @param pattern Pattern
 */
export function isPatternCorrect(pattern) {
    return regex.test(pattern);
}
/**
 * Generates a configuration for `Intl.NumberFormat` from the given pattern.
 *
 * @see readme.md for documentation about the pattern.
 *
 * @param pattern Pattern to transform.
 * @param additionalOptions Additional options to be copied to the resulting object.
 */
export function makeOptions(pattern, additionalOptions) {
    const r = regex.exec(pattern);
    if (!r || r.length < 1) {
        if (additionalOptions) {
            return Object.assign({}, additionalOptions);
        }
        return {};
    }
    const [
    /* fullMatch */ , style, grouping, sign, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits,] = r;
    let obj = objectFromStyle(style);
    if ('#' === grouping) {
        obj.useGrouping = false;
    }
    if ('+' === sign) {
        obj.signDisplay = 'exceptZero';
    }
    else if ('!' === sign) {
        obj.signDisplay = 'never';
    }
    else if ('@' === sign) {
        obj.signDisplay = 'always';
    }
    if (minimumIntegerDigits) {
        obj.minimumIntegerDigits = Number(minimumIntegerDigits);
    }
    if (minimumFractionDigits) {
        obj.minimumFractionDigits = Number(minimumFractionDigits);
    }
    if (maximumFractionDigits) {
        obj.maximumFractionDigits = Number(maximumFractionDigits);
    }
    if (minimumSignificantDigits) {
        obj.minimumSignificantDigits = Number(minimumSignificantDigits);
    }
    if (maximumSignificantDigits) {
        obj.maximumSignificantDigits = Number(maximumSignificantDigits);
    }
    if (additionalOptions) {
        return Object.assign(obj, additionalOptions);
    }
    return obj;
}
function objectFromStyle(style) {
    const obj = {};
    switch (style) {
        case 'd':
            obj.style = 'decimal';
            break;
        case '%':
            obj.style = 'percent';
            break;
        case 'u':
            obj.style = 'unit';
            break;
        case '$':
            obj.style = 'currency';
            obj.currencyDisplay = 'symbol';
            break;
        case 'w':
            obj.style = 'currency';
            obj.currencyDisplay = 'narrowSymbol';
            break;
        case 'n':
            obj.style = 'currency';
            obj.currencyDisplay = 'name';
            break;
        case 'o':
            obj.style = 'currency';
            obj.currencyDisplay = 'code';
            break;
        case 'a':
            obj.style = 'currency';
            // obj.currencyDisplay = 'symbol';
            obj.currencySign = 'accounting';
            break;
        case 'E':
            obj.notation = 'scientific';
            break;
        case 'e':
            obj.notation = 'engineering';
            break;
        case 'c':
            obj.notation = 'compact';
            break;
        case 'l':
            obj.notation = 'compact';
            obj.compactDisplay = 'long';
            break;
        case 's':
            obj.notation = 'compact';
            obj.compactDisplay = 'short';
            break;
        // default: ;
    }
    return obj;
}
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
export function formatNumber(value, locale, pattern, additionalOptions) {
    if (!pattern) {
        return new Intl.NumberFormat(locale, additionalOptions).format(value);
    }
    const obj = makeOptions(pattern, additionalOptions);
    // Property `style` requires the definition of property `currency`
    if ('currency' === obj.style && !obj.currency) {
        const defaultCurrency = 'USD';
        obj.currency = locale
            ? currencyFromLocale(locale) || defaultCurrency
            : defaultCurrency;
    }
    return new Intl.NumberFormat(locale, obj).format(value);
}
