import { currencyFromLocale, extractCountryCode, formatNumber, isPatternCorrect, makeOptions } from '../src';

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

			// wrong pattern returns an empty object
			[ 'WRONG', undefined, {} ],

			// wrong pattern with additional object returns the object
			[ 'WRONG', { style: 'decimal' }, { style: 'decimal' } ],

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

            // grouping
            [ '#', undefined, { useGrouping: false } ],

            // sign
            [ '+', undefined, { signDisplay: 'exceptZero' } ],
            [ '!', undefined, { signDisplay: 'never' } ],
            [ '@', undefined, { signDisplay: 'always' } ],

            // integer-digits
            [ '0', undefined, { minimumIntegerDigits: 0 } ],
            [ '21', undefined, { minimumIntegerDigits: 21 } ],

            // fraction-range
            [ '.1', undefined, { minimumFractionDigits: 1 } ],
            [ '.1-2', undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 } ],

            // significant-range
            [ ';1', undefined, { minimumSignificantDigits: 1 } ],
            [ ';1-2', undefined, { minimumSignificantDigits: 1, maximumSignificantDigits: 2 } ],
            [ '#;1-2', undefined, { useGrouping: false, minimumSignificantDigits: 1, maximumSignificantDigits: 2 } ],

            // Additional options
            [ '', { currency: 'USD' }, { currency: 'USD' } ],
            [ '$', { currency: 'USD' }, { style: 'currency', currencyDisplay: 'symbol', currency: 'USD' } ],

			// More examples
			[ '$7.1', undefined, { style: 'currency', currencyDisplay: 'symbol', minimumIntegerDigits: 7, minimumFractionDigits: 1 } ],
            [ '$7.1-2', undefined, { style: 'currency', currencyDisplay: 'symbol', minimumIntegerDigits: 7, minimumFractionDigits: 1, maximumFractionDigits: 2 } ],
            [ '$7.1-2;1', undefined, { style: 'currency', currencyDisplay: 'symbol', minimumIntegerDigits: 7, minimumFractionDigits: 1, maximumFractionDigits: 2, minimumSignificantDigits: 1 } ],
			[ '$+7.1-2;1-2', undefined, { style: 'currency', currencyDisplay: 'symbol', signDisplay: 'exceptZero', minimumIntegerDigits: 7, minimumFractionDigits: 1, maximumFractionDigits: 2, minimumSignificantDigits: 1, maximumSignificantDigits: 2 } ],
			[ '$#+7.1-2;1-2', undefined, { style: 'currency', currencyDisplay: 'symbol', useGrouping: false, signDisplay: 'exceptZero', minimumIntegerDigits: 7, minimumFractionDigits: 1, maximumFractionDigits: 2, minimumSignificantDigits: 1, maximumSignificantDigits: 2 } ],

        ] )( 'Pattern "%s" + %o = %o', fn );

    } );


    describe( '#formatNumber', () => {

        const nf = ( value: number, locales?: string|string[], options?: any ): string => {
            // return ( new NumberFormat( locales, options ) ).format( value );
            return ( new Intl.NumberFormat( locales, options ) ).format( value );
        };

        const fn = (
            value: number,
            locale?: string,
            pattern?: string,
            additionalOptions?: any,
            expected?: string
            ) => {
            const s = formatNumber( value, locale, pattern, additionalOptions );
            expect( s ).toEqual( expected );
        };

		// Results are compared to those produced with Intl.NumberFormat
        it.each( [
            [ 0, 'en', '', undefined, nf( 0, 'en', {} ) ],

            // It assumes the default currency (USD) when the country is not defined
			[ 0, 'en', '$', undefined, nf( 0, 'en', { style: 'currency', currency: 'USD' } ) ],
            // It assumes the default currency (USD) when the locale is not defined
			[ 0, undefined, '$', undefined, nf( 0, undefined, { style: 'currency', currency: 'USD' } ) ],

            // Currency of BR -> BRL
            [ 0, 'pt-BR', '$', undefined, nf( 0, 'pt-BR', { style: 'currency', currency: 'BRL' } ) ],
            [ 9_999_999, 'pt-BR', '$', undefined, nf( 9_999_999, 'pt-BR', { style: 'currency', currency: 'BRL' } ) ],
            [ 9_999_999, 'pt-BR', '$#', undefined, nf( 9_999_999, 'pt-BR', { style: 'currency', currency: 'BRL', useGrouping: false } ) ],

            [ 0, 'en', 'd', undefined, nf( 0, 'en', { style: 'decimal' } ) ],

        ] )( '%s for "%s" with pattern "%s" and %o is "%s"', fn );

	} );


	describe( '#isPatternCorrect', () => {

		it( 'evaluates an empty string as correct', () => {
			const r = isPatternCorrect( '' );
			expect( r ).toBeTruthy();
		} );

	} );



	describe( '#extractCountryCode', () => {

		it( 'does not extract from an empty locale', () => {
			const r = extractCountryCode( '' );
			expect( r ).toBeNull();
		} );

		it( 'does not extract from an invalid locale', () => {
			const r = extractCountryCode( 'foo bar' );
			expect( r ).toBeNull();
		} );

		it( 'does not extract from a valid locale without country', () => {
			const r = extractCountryCode( 'en' );
			expect( r ).toBeNull();
		} );

		it( 'extracts from a valid locale with country code after dash', () => {
			const r = extractCountryCode( 'en-US' );
			expect( r ).toEqual( 'US' );
		} );

		it( 'extracts from a valid locale with country code in lowercase, after dash', () => {
			const r = extractCountryCode( 'en-us' );
			expect( r ).toEqual( 'US' );
		} );

		it( 'extracts from a valid locale with country code in lowercase, after underline', () => {
			const r = extractCountryCode( 'en_us' );
			expect( r ).toEqual( 'US' );
		} );

		it( 'extracts from a valid locale with country code in the third part', () => {
			const r = extractCountryCode( 'zh-Hans-CN' );
			expect( r ).toEqual( 'CN' );
		} );

	} );


	describe( '#currencyFromLocale', () => {

		it( 'does not extract it from an empty locale', () => {
			const r = currencyFromLocale( '' );
			expect( r ).toEqual( null );
		} );

		it( 'does not extract it from an invalid locale', () => {
			const r = currencyFromLocale( 'WRONG' );
			expect( r ).toEqual( null );
		} );

		it( 'does not extract it from a valid locale without country', () => {
			const r = currencyFromLocale( 'en' );
			expect( r ).toEqual( null );
		} );

		it( 'does not extract it from a locale with an wrong country', () => {
			const r = currencyFromLocale( 'en-WRONG' );
			expect( r ).toEqual( null );
		} );

		it( 'extracts it from a locale with a correct country', () => {
			const r = currencyFromLocale( 'en-US' );
			expect( r ).toEqual( 'USD' );
		} );

	} );

} );
