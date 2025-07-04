// CONVENTION formatFoo -> string

// import { Currency, CurrencyAmount, Fraction, JSBI, Price } from '../sdk'

import { BigNumber } from '@ethersproject/bignumber'
import Numeral from 'numeral'
import {formatUnits} from 'ethers'
import { getAddress } from '@ethersproject/address'


export const capitalize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const formatK = (value: string) => {
  return Numeral(value).format('0.[00]a')
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress (address: string, chars = 4): string {
  try {
    const parsed = getAddress(address)
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
  } catch (error) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
}

// shorten string to its maximum length using three dots
export function shortenString (string: string, length: number): string {
  if (!string) return ''
  if (length < 5) return string
  if (string.length <= length) return string
  return string.slice(0, 4) + '...' + string.slice(string.length - length + 5, string.length)
}

// using a currency library here in case we want to add more in future
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export function formatPercent (percentString: any) {
  const percent = parseFloat(percentString)
  if (!percent || percent === Infinity || percent === 0) {
    return '0%'
  }
  if (percent < 0.0001 && percent > 0) {
    return '< 0.0001%'
  }
  if (percent < 0 && percent > -0.0001) {
    return '< 0.0001%'
  }
  const fixedPercent = percent.toFixed(2)
  if (fixedPercent === '0.00') {
    return '0%'
  }
  if (Number(fixedPercent) > 0) {
    if (Number(fixedPercent) > 100) {
      return `${percent?.toFixed(0).toLocaleString()}%`
    } else {
      return `${fixedPercent}%`
    }
  } else {
    return `${fixedPercent}%`
  }
}

export const formatNumber = (number: any, usd = false, scale = true) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0.00' : '0'
  }
  const num = parseFloat(number)

  if (num > 500000000 && scale) {
    return (usd ? '$' : '') + formatK(num.toFixed(0))
  }

  if (num === 0) {
    if (usd) {
      return '$0.00'
    }
    return '0'
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (num > 1000) {
    return usd
      ? '$' + Number(parseFloat(String(num)).toFixed(0)).toLocaleString()
      : '' + Number(parseFloat(String(num)).toFixed(0)).toLocaleString()
  }

  if (usd) {
    if (num < 0.1) {
      return '$' + Number(parseFloat(String(num)).toFixed(4))
    } else {
      const usdString = priceFormatter.format(num)
      return '$' + usdString.slice(1, usdString.length)
    }
  }

  return parseFloat(String(num)).toPrecision(4)
}

export function formatNumberScale (number: any, usd = false, decimals = 2) {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0.00' : '0'
  }
  const num = parseFloat(number)
  const fullNum = Math.floor(num).toLocaleString('fullwide', { useGrouping: false })
  const wholeNumberLength = fullNum.length

  if (wholeNumberLength >= 19) return usd ? '> $1000 Q' : '> 1000 Q'
  if (wholeNumberLength >= 16) return (usd ? '$' : '') + (num / Math.pow(10, 15)).toFixed(decimals) + ' Q'
  if (wholeNumberLength >= 13) return (usd ? '$' : '') + (num / Math.pow(10, 12)).toFixed(decimals) + ' T'
  if (wholeNumberLength >= 10) return (usd ? '$' : '') + (num / Math.pow(10, 9)).toFixed(decimals) + ' B'
  if (wholeNumberLength >= 7) return (usd ? '$' : '') + (num / Math.pow(10, 6)).toFixed(decimals) + ' M'
  if (wholeNumberLength >= 4) return (usd ? '$' : '') + (num / Math.pow(10, 3)).toFixed(decimals) + ' K'

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  return (usd ? '$' : '') + num.toFixed(decimals)
}

export function escapeRegExp (string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// export const formatBalance = (value: ethers.BigNumberish, decimals = 18, maxFraction = 0) => {
//   const formatted = ethers.utils.formatUnits(value, decimals)
//   if (maxFraction > 0) {
//     const split = formatted.split('.')
//     if (split.length > 1) {
//       return split[0] + '.' + split[1].substr(0, maxFraction)
//     }
//   }
//   return formatted
// }
//
// export function formatCurrencyAmount (amount: CurrencyAmount<Currency> | undefined, sigFigs: number) {
//   if (!amount) {
//     return '-'
//   }
//
//   if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
//     return '0'
//   }
//
//   if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
//     return '<0.00001'
//   }
//
//   return amount.toSignificant(sigFigs)
// }
//
// export function formatPrice (price: Price<Currency, Currency> | undefined, sigFigs: number) {
//   if (!price) {
//     return '-'
//   }
//
//   if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
//     return '<0.0001'
//   }
//
//   return price.toSignificant(sigFigs)
// }

export function formatDateAgo (date: Date) {
  const currentDate = new Date()
  const secondsAgo = Math.floor((currentDate.getTime() - date.getTime()) / 1000)

  if (secondsAgo < 60) return `${secondsAgo} Second${secondsAgo === 1 ? '' : 's'} Ago`
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} Minute${secondsAgo / 120 >= 1 ? 's' : ''} Ago`
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} Hour${secondsAgo / 7200 >= 1 ? 's' : ''} Ago`
  if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 86400)} Day${secondsAgo / 172800 >= 1 ? 's' : ''} Ago`
  if (secondsAgo < 31536000)
    return `${Math.floor(secondsAgo / 2592000)} Month${secondsAgo / 5184000 >= 1 ? 's' : ''} Ago`

  return `${Math.floor(secondsAgo / 31536000)} Year${secondsAgo / 63072000 >= 1 ? 's' : ''} Ago`
}

export function formatTime (seconds) {
  if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'}`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${seconds / 120 >= 1 ? 's' : ''}`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${seconds / 7200 >= 1 ? 's' : ''}`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} day${seconds / 172800 >= 1 ? 's' : ''}`
  if (seconds < 31536000)
    return `${Math.floor(seconds / 2592000)} month${seconds / 5184000 >= 1 ? 's' : ''}`

  return `${Math.floor(seconds / 31536000)} year${seconds / 63072000 >= 1 ? 's' : ''}`
}

export type FormatOption = {
  locale: string
  compact: boolean
  fractionDigits: number
  keepTrailingZeros: boolean
  significantDigits?: number
  percentage?: boolean
  currency?: string
  thousandGrouping: boolean
}

/**
 * convert format option to Intl options
 */
const parseConfig = (fmt: FormatOption): Intl.NumberFormatOptions => {
  const ret: Intl.NumberFormatOptions = {
    maximumFractionDigits: fmt.fractionDigits
  }

  if (fmt.compact) {
    ret.notation = 'compact'
  }
  if (fmt.keepTrailingZeros) {
    ret.minimumFractionDigits = fmt.fractionDigits
  }

  if (fmt.significantDigits) {
    ret.minimumSignificantDigits = fmt.significantDigits
    ret.maximumFractionDigits = 0 //null
  }

  if (fmt.percentage) {
    ret.style = 'percent'
  }

  if (fmt.currency) {
    ret.style = 'currency'
    ret.currency = fmt.currency
    ret.minimumFractionDigits = 0
  }

  if (fmt.thousandGrouping) {
    ret.useGrouping = true
  }

  return ret
}

const defaultFormat: FormatOption = {
  locale: 'en-US',
  compact: true,
  keepTrailingZeros: false,
  fractionDigits: 3,
  percentage: false,
  currency: '',
  thousandGrouping: true
}

const defaultFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 3,
  useGrouping: true
})

/**
 * format fixed string to variours format
 * @param fixed fixed string number
 */
export const formatNumber2 = (input: number, options?: Partial<FormatOption>): string => {
  if (input == null || isNaN(input)) {
    return ''
  }
  let formatter: Intl.NumberFormat
  if (!options) {
    formatter = defaultFormatter
  } else {
    formatter = new Intl.NumberFormat(
      'en-US',
      parseConfig({
        ...defaultFormat,
        ...options
      })
    )
  }
  return formatter.format(input)
}

// export const formatBigNumber = (
//   input: BigNumber,
//   decimals: number,
//   option?: Partial<FormatOption>,
//   threshold?: number
// ): string => {
//   if (!input) {
//     return '-'
//   }
//   const value = +formatUnits(input, decimals)
//   if (threshold && value > 0 && value < threshold) {
//     return `< ${formatNumber2(threshold, {
//       ...option,
//       significantDigits: 1,
//       compact: false
//     })}`
//   }
//   return formatNumber2(value, option)
// }
