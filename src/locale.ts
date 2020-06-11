// import * as currencyCodeByCountryCode from 'currency-code-map';
const currencyCodeByCountryCode = require( 'currency-code-map' );

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
    return loc ? currencyCodeByCountryCode[ loc ] || null : null;
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

