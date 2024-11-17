import {useSingleCallResult} from "../state/multicall/hooks.ts";
import {usePriceProviderContract} from "./useContract.ts";
import {useMemo} from "react";
import {BigNumber} from "bignumber.js";

export function usePriceProvider() {
    const priceProviderContract = usePriceProviderContract()

    const lpTokenPriceUsd = useSingleCallResult(
        priceProviderContract,
        'getLpTokenPriceUsd',
        []
    )

    const ethPriceUsd = useSingleCallResult(
        priceProviderContract,
        'getEthPrice',
        []
    )

    const tokenPriceUsd = useSingleCallResult(
        priceProviderContract,
        'getTokenPriceUsd',
        []
    )

    const usdDecimals = useSingleCallResult(
        priceProviderContract,
        'decimals',
        []
    )

    return useMemo(() => {
        if (!lpTokenPriceUsd || !tokenPriceUsd || !ethPriceUsd || !usdDecimals) {
            return {
                seiPrice: 0,
                tokenPriceUsd: 0,
                lpTokenPriceUsd: 0,
            }
        }

        return {
            seiPrice: new BigNumber(ethPriceUsd?.result?.[0]?.toString()).div(new BigNumber(10).pow(new BigNumber(18))),
            tokenPriceUsd: new BigNumber(tokenPriceUsd?.result?.[0].toString()).div(new BigNumber(10).pow(new BigNumber(usdDecimals?.result?.[0]?.toString()))),
            lpTokenPriceUsd: new BigNumber(lpTokenPriceUsd?.result?.[0]?.toString()).div(new BigNumber(10).pow(new BigNumber(usdDecimals?.result?.[0]?.toString()))),
        }
    }, [lpTokenPriceUsd, tokenPriceUsd, ethPriceUsd, usdDecimals])
}