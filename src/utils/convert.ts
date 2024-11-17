import Numeral from "numeral";
import { BigNumber } from "bignumber.js";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const formatK = (value: string) => {
  return Numeral(value).format("0.[00]a");
};

export function formatPercent(percentString: any) {
  const percent = parseFloat(percentString);
  if (!percent || percent === Infinity || percent === 0) {
    return "0%";
  }
  if (percent < 0.0001 && percent > 0) {
    return "< 0.0001%";
  }
  if (percent < 0 && percent > -0.0001) {
    return "< 0.0001%";
  }
  const fixedPercent = percent.toFixed(2);
  if (fixedPercent === "0.00") {
    return "0%";
  }
  if (Number(fixedPercent) > 0) {
    if (Number(fixedPercent) > 100) {
      return `${percent?.toFixed(0).toLocaleString()}%`;
    } else {
      return `${fixedPercent}%`;
    }
  } else {
    return `${fixedPercent}%`;
  }
}

export const formatNumber = (number: any, usd = false, scale = true) => {
  if (isNaN(number) || number === "" || number === undefined) {
    return usd ? "$0.00" : "0";
  }
  const num = parseFloat(number);

  if (num > 500000 && scale) {
    return (usd ? "$" : "") + formatK(num.toFixed(0));
  }

  if (num === 0) {
    if (usd) {
      return "$0.00";
    }
    return "0";
  }

  if (num < 0.0001 && num > 0) {
    return usd ? "< $0.0001" : "< 0.0001";
  }

  if (num > 1000) {
    return usd
      ? "$" + Number(parseFloat(String(num)).toFixed(0)).toLocaleString()
      : "" + Number(parseFloat(String(num)).toFixed(0)).toLocaleString();
  }

  if (usd) {
    if (num < 0.1) {
      return "$" + Number(parseFloat(String(num)).toFixed(4));
    } else {
      const usdString = priceFormatter.format(num);
      return "$" + usdString.slice(1, usdString.length);
    }
  }

  return parseFloat(String(num)).toPrecision(4);
};

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function tryParseAmount(value?: string, currency?: any): undefined {
  return undefined;
}

export function formatRawAmount(number: any, decimals: any) {
  return number / 10 ** decimals;
}

export function formatAmountToRaw(number: any, decimals: any) {
  return new BigNumber(number).multipliedBy(10 ** Number(decimals)).toFixed(0);
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function shortenTransactionID(
  transactionID: string,
  length: number = 20
) {
  if (!transactionID) return "-";
  if (transactionID.length <= length) {
    return transactionID;
  } else {
    const prefixLength = Math.floor((length - 4) / 2);
    const suffixLength = length - 4 - prefixLength;
    const prefix = transactionID.substring(0, prefixLength);
    const suffix = transactionID.substring(transactionID.length - suffixLength);
    return `${prefix}...${suffix}`;
  }
}

export function formatWallet(str, isMobile){
  return isMobile
    ? str.substring(0, 3) + '...' + str.substring(str.length - 2)
    : str.substring(0, 3) + '...' + str.substring(str.length - 5);
}

// export function tryParseAmount<T extends Currency>(value?: string, currency?: T): CurrencyAmount<T> | undefined {
//     if (!value || !currency) {
//         return undefined
//     }
//     try {
//         const typedValueParsed = parseUnits(value, currency?.decimals).toString()
//         if (typedValueParsed !== '0') {
//             return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed))
//         }
//     } catch (error) {
//         // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
//         console.debug(`Failed to parse input amount: "${value}"`, error)
//     }
//     // necessary for all paths to return a value
//     return undefined
// }
