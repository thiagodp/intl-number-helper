import { extractCountryCode, currencyFromLocale } from "../src/locale";

describe( 'locale', () => {

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
