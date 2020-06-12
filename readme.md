[![Build Status](https://travis-ci.org/thiagodp/intl-number-helper.svg?branch=master)](https://travis-ci.org/thiagodp/intl-number-helper)
[![npm version](https://badge.fury.io/js/intl-number-helper.svg)](https://badge.fury.io/js/intl-number-helper)

# intl-number-helper

> 💰 Configure EcmaScript's [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) with a string pattern

For example, **instead of using**:

```typescript
const options = { style: 'currency', currencyDisplay: 'symbol', currency: 'USD' };
const numberStr = new Intl.NumberFormat( 'en-US', options ).format( 123456 );
```

You can use `makeOptions`:

```typescript
const options = makeOptions( '$', { currency: 'USD' } );
const numberStr = new Intl.NumberFormat( 'en-US', options ).format( 123456 );
```

Or even shorter, with `formatNumber`:

```typescript
const numberStr = formatNumber( 123456, 'en-US', '$' ); // Guesses the currency code
```

 ✨The function `formatNumber` uses `Intl.NumberFormat` internally and guesses the currency code ([ISO 4247](https://en.wikipedia.org/wiki/ISO_4217#Active_codes)) from the country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements)).

## Installation

```bash
npm i intl-number-helper
```

Notes:
- It does not polyfill `Intl.NumberFormat` (_you can use your own polyfill if you need it_).
- ES6/ES2015 and TypeScript.
- Unit-tested.

Some polyfills for `Intl.NumberFormat`:
- [@formatjs/intl-numberformat](https://formatjs.io/docs/polyfills/intl-numberformat) - Browsers and NodeJS (_recommended_)
- [Intl.js](https://github.com/andyearnshaw/Intl.js/) - Browsers and NodeJS

> Although NodeJS offers support to `Intl.NumberFormat` from version `10`, a polyfill like formatjs' is recommended, since it is more complete and correct.

## API

```typescript

/**
 * Formats a number.
 *
 * @param value Value to be formatted.
 * @param locale Locale. When `pattern` uses currency, it guesses the currency from the country code.
 * @param pattern Pattern. Optional. It generates an empty options object by default.
 * @param additionalOptions Options to be added to those generated from the pattern. Optional. Useful for units.
 *
 * @throws Error When
 */
function formatNumber(
    value: number,
    locale: string,
    pattern?: string,
    additionalOptions?: Intl.NumberFormatOptions
): string;

/**
 * Creates a `Intl.NumberFormatOptions` object from a given pattern.

 * @param pattern Pattern. Optional. It generates an empty options object by default.
 * @param additionalOptions Options to be added to those generated from the pattern. Optional. Useful for units.
 */
function makeOptions(
    pattern?: string,
    additionalOptions?: Intl.NumberFormatOptions
): Intl.NumberFormatOptions;

/**
 * Indicates if the given pattern is correct.
 *
 * @param pattern Pattern
 */
function isPatternCorrect( pattern: string ): boolean;
```

## Examples

```typescript
import { formatNumber } from 'intl-number-helper';

// US$123,456.00
console.log( formatNumber( 123456, 'en-US', '$' ) );

// R$ 123.456,00
console.log( formatNumber( 123456, 'pt-BR', '$7.2' ) );

// US$123,456.00
console.log( formatNumber( 123456, 'en-US', '$7.2' ) );

// 123,456.00 American dollars
console.log( formatNumber( 123456, 'en-US', 'n7.2' ) );

// 123,456.00
console.log( formatNumber( 123456, 'en-US', 'd7.2' ) );

// 123,456
console.log( formatNumber( 123456, 'en-US', 'd' ) );

// 123456
console.log( formatNumber( 123456, 'en-US', 'd#' ) );

// 123,456 kilometers per hour
console.log( formatNumber( 123456, 'en-US', 'u',
    { unit: 'kilometer-per-hour', unitDisplay: 'long' } ) );

```

## Patterns

Pattern is `symbol grouping sign integer-digits fraction-range significant-range`, in this order.

Every part is **optional**.

### symbol

| Pattern example | Generated object |
| --------------- | ---------------- |
| `'d'` | `{ style: 'decimal' }` |
| `'%'` | `{ style: 'percent' }` |
| `'u'` | `{ style: 'unit' }` |
| `'$'` | `{ style: 'currency', currencyDisplay: 'symbol' }` |
| `'w'` | `{ style: 'currency', currencyDisplay: 'narrowSymbol' }` |
| `'n'` | `{ style: 'currency', currencyDisplay: 'name' }` |
| `'o'` | `{ style: 'currency', currencyDisplay: 'code' }` |
| `'a'` | `{ style: 'currency', currencySign: 'accounting' }` |
| `'E'` | `{ notation: 'scientific' }` |
| `'e'` | `{ notation: 'engineering' }` |
| `'c'` | `{ notation: 'compact' }` |
| `'l'` | `{ notation: 'compact', compactDisplay: 'long' }` |
| `'s'` | `{ notation: 'compact', compactDisplay: 'short' }` |

Note: `%` makes the value be divided by 10. That's a behavior from `Intl.NumberFormat`.

### grouping

| Pattern example | Generated object |
| --------------- | ---------------- |
| `''`            | `{}`, which is the same as `{ useGrouping: true }` (default value) |
| `'#'`           | `{ useGrouping: false }` |

### sign

| Pattern example | Generated object |
| --------------- | ---------------- |
| `''` (empty)    | `{}`, which is the same as `{ signDisplay: 'auto' }` (default value) |
| `'+'`           | `{ signDisplay: 'exceptZero' }` |
| `'!'`           | `{ signDisplay: 'never' }` |
| `'@'`           | `{ signDisplay: 'always' }` |


### integer-digits

A number between `0` and `21` (inclusive).

| Pattern example | Generated object |
| --------------- | ---------------- |
| `'7'`           | `{ minimumIntegerDigits: 7 }` |

### fraction-range

- It establishes the minimum and the maximum digits for the fraction part.
- It must be preceded by `.` and use `-` to separate the values (numbers).
- The minimum part is always informed.
- Every number must be between `1` and `20` (inclusive).

| Pattern example | Generated object |
| --------------- | ---------------- |
| `'.1'`          | `{ minimumFractionDigits: 1 }` |
| `'.1-2'`        | `{ minimumFractionDigits: 1, maximumFractionDigits: 2 }` |
| `'#1-2'`        | `{ useGrouping: false, minimumFractionDigits: 1, maximumFractionDigits: 2 }` |

### significant-range

- Same as `fraction-range`, but preceded by `;`

| Pattern example | Generated object |
| --------------- | ---------------- |
| `';1'`          | `{ minimumSignificantDigits: 1 }` |
| `';1-2'`        | `{ minimumSignificantDigits: 1, maximumSignificantDigits: 2 }` |
| `'#;1-2'`       | `{ useGrouping: false, minimumSignificantDigits: 1, maximumSignificantDigits: 2 }` |

## More examples

> Putting some patterns together

| Pattern&nbsp;example | Generated object |
| --------------- | ---------------- |
| `'$7.2-2'`      | `{ style: 'currency', currencyDisplay: 'symbol', minimumIntegerDigits: 7, minimumFractionDigits: 2, maximumFractionDigits: 2 }` |
| `'$7.2-2;2'`    | `{ style: 'currency', currencyDisplay: 'symbol', minimumIntegerDigits: 7, minimumFractionDigits: 2, maximumFractionDigits: 2, minimumSignificantDigits: 2 }` |
| `'$+7.2-2;1-2'` | `{ style: 'currency', currencyDisplay: 'symbol', signDisplay: 'exceptZero', minimumIntegerDigits: 7, maximumFractionDigits: 2, minimumSignificantDigits: 1, maximumSignificantDigits: 2 }` |

## To-Do

- To offer support to more patterns.

Suggestions? Please [open an Issue](https://github.com/thiagodp/intl-number-helper/issues/new). 👍

## License

[MIT](license.txt) © [Thiago Delgado Pinto](https://github.com/thiagodp)
