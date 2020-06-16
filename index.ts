import countryToCurrency from 'country-to-currency';

// @see https://tc39.es/ecma402/#sec-properties-of-intl-numberformat-instances

// type NumberFormatOptions = Intl.NumberFormatOptions;

// There are more options, but we will only use the following:
interface NumberFormatOptions {

    style?: 'decimal' | 'percent' | 'unit' | 'currency';

    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
    compactDisplay?: 'long' | 'short';

    currency?: string;
    currencyDisplay?: 'symbol' | 'narrowSymbol' | 'name' | 'code';
    currencySign?: 'standard' | 'accounting';
    signDisplay?: 'auto' | 'always' | 'exceptZero' | 'never';

    useGrouping?: boolean;

    minimumIntegerDigits?: number; // 1 to 21
    minimumFractionDigits?: number; // 0 to 20
    maximumFractionDigits?: number; // 0 to 20
    minimumSignificantDigits?: number; // 0 to 20
    maximumSignificantDigits?: number; // 0 to 20
}

// Try it on https://regex101.com
const regex = /^([$d%u$wnoaEecls])?(?: |\\t)*(\#?)(?: |\\t)*([+!@])?([0-9]{0,2})(?:\.([0-9]{0,2})(?:\-([0-9]{0,2}))?)?(?:\;([0-9]{0,2})(?:\-([0-9]{0,2}))?)?$/;

/**
 * Indicates if the given pattern is correct.
 *
 * @param pattern Pattern
 */
export function isPatternCorrect( pattern: string ): boolean {
    return regex.test( pattern );
}

/**
 * Generates a configuration for `Intl.NumberFormat` from the given pattern.
 *
 * @see readme.md for documentation about the pattern.
 *
 * @param pattern Pattern to transform.
 * @param additionalOptions Additional options to be copied to the resulting object.
 */
export function makeOptions(
    pattern: string,
    additionalOptions?: NumberFormatOptions
): NumberFormatOptions {

    const r: RegExpExecArray | null = regex.exec( pattern );
    if ( ! r || r.length < 1 ) {
        if ( additionalOptions ) {
            return Object.assign( {}, additionalOptions );
        }
        return {};
    }

    const [
        /* fullMatch */,
		style,
		grouping,
        sign,
        minimumIntegerDigits,
        minimumFractionDigits,
        maximumFractionDigits,
        minimumSignificantDigits,
        maximumSignificantDigits,
    ] = r;

	let obj: NumberFormatOptions = objectFromStyle( style );

    if ( '#' === grouping ) {
        obj.useGrouping = false;
    }

    if ( '+' === sign ) {
        obj.signDisplay = 'exceptZero';
    } else if ( '!' === sign ) {
        obj.signDisplay = 'never';
    } else if ( '@' === sign ) {
        obj.signDisplay = 'always';
    }

    if ( minimumIntegerDigits ) {
        obj.minimumIntegerDigits = Number( minimumIntegerDigits );
    }

    if ( minimumFractionDigits ) {
        obj.minimumFractionDigits = Number( minimumFractionDigits );
    }

    if ( maximumFractionDigits ) {
        obj.maximumFractionDigits = Number( maximumFractionDigits );
    }

    if ( minimumSignificantDigits ) {
        obj.minimumSignificantDigits = Number( minimumSignificantDigits );
    }

    if ( maximumSignificantDigits ) {
        obj.maximumSignificantDigits = Number( maximumSignificantDigits );
    }

    if ( additionalOptions ) {
        return Object.assign( obj, additionalOptions );
    }
    return obj;
}


function objectFromStyle( style: string ): NumberFormatOptions {

    const obj: NumberFormatOptions = {};

    switch ( style ) {
        case 'd': obj.style = 'decimal'; break;
        case '%': obj.style = 'percent'; break;
        case 'u': obj.style = 'unit'; break;
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
        case 'E': obj.notation = 'scientific'; break;
        case 'e': obj.notation = 'engineering'; break;
        case 'c': obj.notation = 'compact'; break;
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
export function formatNumber(
    value: number,
    locale?: string,
    pattern?: string,
    additionalOptions?: NumberFormatOptions
): string {

    if ( ! pattern ) {
        return new Intl.NumberFormat( locale, additionalOptions ).format( value );
    }

    const obj = makeOptions( pattern, additionalOptions );

    // Property `style` requires the definition of property `currency`
    if ( 'currency' === obj.style && ! obj.currency ) {
        const defaultCurrency = 'USD';
        obj.currency = locale
            ? currencyFromLocale( locale ) || defaultCurrency
            : defaultCurrency;
    }

    return new Intl.NumberFormat( locale, obj ).format( value );
}

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
export function currencyFromLocale( locale: string ): string | null {
    const loc = extractCountryCode( locale );
    return loc ? countryToCurrency[ loc ] || null : null;
}

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
export function extractCountryCode( locale: string ): string | null {
    const [ , l2, l3 ] = ( locale || '' ).replace( '_', '-' ).split( '-' );
    if ( l3 ) {
        return l3.toUpperCase();
    }
    return l2 ? l2.toUpperCase() : null;
}

// /**
//  * Format a locale.
//  *
//  * @example
//  *  - 'en-us' -> 'en-US'
//  *
//  * @param locale Locale to format
//  */
// export function formatLocale( locale: string ): string {
//     const [ l1, l2, l3 ] = locale.replace( '_', '-' ).split( '-' );
//     const pieces = [];
//     pieces.push( l1.toLowerCase() );
//     if ( l2 && l3 ) {
//         pieces.push( l2.charAt( 1 ).toUpperCase() + l2.substr( 1 ).toLowerCase() );
//         pieces.push( l3.toUpperCase() );
//     } else if ( l2 ) {
//         pieces.push( l2.toUpperCase() );
//     }
//     return pieces.join( '-' );
// }

