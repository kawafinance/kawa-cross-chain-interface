import {useCallback, useState} from 'react'
import {
    useMarketContractConfig,
    useWEthRouterContractConfig
} from "./useContract.ts";
import {useAccount, useChainId, useWriteContract} from "wagmi";
import {isNative} from "../utils/contract.ts"
import useClientGas from "./useClientGas.ts";
import {ChainId} from "../constants/chains.ts";

export default function useMarketContract(assetAddress:string, clientAddress: string, farmChainId: ChainId, type: string) {
    const {address} = useAccount()
    const chainId = useChainId()

    const [txChainId, setTxChainId] = useState<ChainId | undefined>(undefined)

    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const contractAddress = isNative(assetAddress)
        ? assetAddress
        : farmChainId === chainId
            ? clientAddress
            : assetAddress

    const assetContract = useMarketContractConfig(contractAddress)
    const wethRouterContract = useWEthRouterContractConfig()
    const clientGas = useClientGas(contractAddress, type)
    const messageGas = isNative(assetAddress) ? BigInt(0) : clientGas;

    // Mint
    const mint = useCallback(
        (amount: string | undefined) => {
            try {
                if (amount) {
                    if (isNative(assetAddress)) {
                        // @ts-ignore
                        writeContract({
                            ...wethRouterContract,
                            functionName: 'mint',
                            value: BigInt(amount),
                            args: [address!]
                        })
                    } else {
                        // @ts-ignore
                        writeContract({
                            ...assetContract,
                            functionName: 'mint',
                            value: messageGas + BigInt(amount),
                            args: [BigInt(amount)]
                        })
                    }
                    setTxChainId(chainId)
                }
            } catch
                (e) {
                console.error(e)
                return e
            }
        }
        ,
        [assetContract]
    )

// Redeem
    const redeem = useCallback(
        (redeemTokens: string | undefined) => {
            try {
                if (redeemTokens) {
                    // @ts-ignore
                    writeContract({
                        ...assetContract,
                        functionName: 'redeem',
                        value: BigInt(messageGas),
                        args: [BigInt(redeemTokens)]
                    })
                    setTxChainId(chainId)
                }
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [assetContract]
    )

// RedeemUnderlying
    const redeemUnderlying = useCallback(
        (redeemAmount: string | undefined) => {
            try {
                if (redeemAmount) {
                    // @ts-ignore
                    writeContract({
                        ...assetContract,
                        functionName: 'redeemUnderlying',
                        value: BigInt(messageGas),
                        args: [BigInt(redeemAmount)]
                    })
                    setTxChainId(chainId)
                }
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [assetContract]
    )

// borrow
    const borrow = useCallback(
        (amount: string | undefined) => {
            try {
                if (amount) {
                    // @ts-ignore
                    writeContract({
                        ...assetContract,
                        functionName: 'borrow',
                        value: BigInt(messageGas),
                        args: [BigInt(amount)]
                    })
                    setTxChainId(chainId)
                }
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [assetContract]
    )

// repay
    const repayBorrow = useCallback(
        (amount: string | undefined) => {
            try {
                // Unused
                // if (isNative(assetAddress)) {
                //     if (amount) {
                //         // @ts-ignore
                //         writeContract({
                //             ...assetContract,
                //             functionName: 'repayBorrow',
                //             value: BigInt(amount)
                //         })
                //     }
                //     // return await assetContract?.repayBorrow({value: amount})
                // } else {
                //     if (amount) {
                //         // @ts-ignore
                //         writeContract({
                //             ...assetContract,
                //             functionName: 'repayBorrow',
                //             value: BigInt(messageGas),
                //             args: [BigInt(amount)]
                //         })
                //     }
                // setTxChainId(chainId)
                //     // return await assetContract?.repayBorrow(amount)
                // }
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [assetContract]
    )

// repayBehalf
    const repayBorrowBehalf = useCallback(
        (borrower: string | undefined | null, amount: string | undefined, repayAll: boolean = false) => {
            if (borrower) {
                try {
                    if (isNative(assetAddress)) {
                        if (amount) {
                            // @ts-ignore
                            writeContract({
                                ...wethRouterContract,
                                functionName: 'repayBorrowBehalf',
                                args: [borrower],
                                value: BigInt(amount)
                            })
                        }
                        // return await assetContract?.repayBorrowBehalf(
                        //     borrower,
                        //     {value: amount}
                        // )
                    } else {
                        if (amount) {
                            // @ts-ignore
                            writeContract({
                                ...assetContract,
                                functionName: 'repayBorrowBehalf',
                                value: BigInt(messageGas) + BigInt(amount),
                                args: [borrower, BigInt(amount)]
                            })
                        }
                        setTxChainId(chainId)
                        // return await assetContract?.repayBorrowBehalf(borrower, amount)
                    }
                } catch (e) {
                    console.error(e)
                    return e
                }
            }
        },
        [assetContract]
    )

    return {mint, redeem, redeemUnderlying, borrow, repayBorrow, repayBorrowBehalf, hash, txChainId, error, isPending}
}
  