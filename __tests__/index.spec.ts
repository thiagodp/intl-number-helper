import { makeOptions, formatNumber } from "../src/index";

// import { NumberFormat, NumberFormatOptions } from '@formatjs/intl-numberformat';

// NumberFormat.__addLocaleData(
//     require('@formatjs/intl-numberformat/dist/locale-data/en.json') // locale-data for en
// );

// NumberFormat.__addLocaleData(
//     require('@formatjs/intl-numberformat/dist/locale-data/pt.json') // locale-data for pt
// );

describe( 'intl-number-helper', () => {

    describe( '#makeOptions', () => {

        const fn = (
            pattern: string,
            additionalOptions: any,
            expected: any
            ) => {
            const o = makeOptions( pattern, additionalOptions );
            expect( o ).toEqual( expected );
        };

        it.each( [

            // empty
            [ '', undefined, {} ],

            // symbol
            [ 'd', undefined, { style: 'decimal' } ],
            [ '%', undefined, { style: 'percent' } ],
            [ 'u', undefined, { style: 'unit' } ],
            [ '$', undefined, { style: 'currency', currencyDisplay: 'symbol' } ],
            [ 'w', undefined, { style: 'currency', currencyDisplay: 'narrowSymbol' } ],
            [ 'n', undefined, { style: 'currency', currencyDisplay: 'name' } ],
            [ 'o', undefined, { style: 'currency', currencyDisplay: 'code' } ],
            [ 'a', undefined, { style: 'currency', currencySign: 'accounting' } ],
            [ 'E', undefined, { notation: 'scientific' } ],
            [ 'e', undefined, { notation: 'engineering' } ],
            [ 'c', undefined, { notation: 'compact' } ],
            [ 'l', undefined, { notation: 'compact', compactDisplay: 'long' } ],
            [ 's', undefined, { notation: 'compact', compactDisplay: 'short' } ],

            // sign
            [ '+', undefined, { signDisplay: 'exceptZero' } ],
            [ '!', undefined, { signDisplay: 'never' } ],
            [ '@', undefined, { signDisplay: 'always' } ],

            // integer-digits
            [ '0', undefined, { minimumIntegerDigits: 0 } ],
            [ '21', undefined, { minimumIntegerDigits: 21 } ],

            // grouping
            [ '.', undefined, {} ],
            [ '#', undefined, { useGrouping: false } ],

            // fraction-range
            [ '.1', undefined, { minimumFractionDigits: 1 } ],
            [ '.:2', undefined, { maximumFractionDigits: 2 } ],
            [ '.1:2', undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 } ],
            [ '#1:2', undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2, useGrouping: false } ],

            // significant-range
            [ ';1', undefined, { minimumSignificantDigits: 1 } ],
            [ ';:2', undefined, { maximumSignificantDigits: 2 } ],
            [ ';1:2', undefined, { minimumSignificantDigits: 1, maximumSignificantDigits: 2 } ],
            [ '#;1:2', undefined, { minimumSignificantDigits: 1, maximumSignificantDigits: 2, useGrouping: false } ],

            // Additional options
            [ '', { currency: 'USD' }, { currency: 'USD' } ],
            [ '$', { currency: 'USD' }, { style: 'currency', currencyDisplay: 'symbol', currency: 'USD' } ],

            // More examples
            [ '$7.:2', undefined, { style: 'currency', currencyDisplay: 'symbol', minimumIntegerDigits: 7, maximumFractionDigits: 2 } ],
            [ '$7.:2;2', undefined, { style: 'currency', currencyDisplay: 'symbol', minimumIntegerDigits: 7, maximumFractionDigits: 2, minimumSignificantDigits: 2 } ],
            [ '$+7.:2;2', undefined, { style: 'currency', currencyDisplay: 'symbol', minimumIntegerDigits: 7, maximumFractionDigits: 2, minimumSignificantDigits: 2, signDisplay: 'exceptZero' } ],

        ] )( 'Pattern "%s" + %o = %o', fn );

    } );


    describe( '#formatNumber', () => {

        const nf = ( value: number, locales: string|string[], options: any ): string => {
            // return ( new NumberFormat( locales, options ) ).format( value );
            return ( new Intl.NumberFormat( locales, options ) ).format( value );
        };

        const fn = (
            value: number,
            locale: string,
            pattern: string,
            additionalOptions: any,
            expected: string
            ) => {
            const s = formatNumber( value, locale, pattern, additionalOptions );
            expect( s ).toEqual( expected );
        };

        it.each( [
            [ 0, 'en', '', undefined, nf( 0, 'en', {} ) ],

            // Default currency
            [ 0, 'en', '$', undefined, nf( 0, 'en', { style: 'currency', currency: 'USD' } ) ],
            // Currency of BR -> BRL
            [ 0, 'pt-BR', '$', undefined, nf( 0, 'pt-BR', { style: 'currency', currency: 'BRL' } ) ],
            [ 9_999_999, 'pt-BR', '$', undefined, nf( 9_999_999, 'pt-BR', { style: 'currency', currency: 'BRL' } ) ],
            [ 9_999_999, 'pt-BR', '$#', undefined, nf( 9_999_999, 'pt-BR', { style: 'currency', currency: 'BRL', useGrouping: false } ) ],

            [ 0, 'en', 'd', undefined, nf( 0, 'en', { style: 'decimal' } ) ],

        ] )( '%s for "%s" with pattern "%s" and %o is "%s"', fn );

    } );

} );