import {useTokenContract, useTokenContractConfig} from "./useContract";
import {useCallback, useEffect, useMemo} from "react";
import {MaxUint256} from '@ethersproject/constants'
import {useAccount, useReadContract, useTransaction, useWriteContract} from "wagmi"

export function useToken(token?: string, spender?: string, amountToCheck?: string) {
    const {address} = useAccount()
    const owner = address
    const contract = useTokenContractConfig(token!)
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const inputs = useMemo(() => address && spender ? [address, spender] : [], [owner, spender])
    // @ts-ignore
    const {data: allowanceResult, refetch} = useReadContract({
        ...contract,
        functionName: 'allowance',
        args: inputs
    })

    const amount = BigInt(amountToCheck === undefined || amountToCheck === 'NaN' ? 0 : amountToCheck)
    const allowance = useMemo(
        () => (token && allowanceResult !== undefined ? BigInt(allowanceResult as bigint) : undefined),
        [token, allowanceResult]
    )

    const needsApprove = useMemo(
        () => (amount > 0 && allowance !== undefined ? amount > allowance : undefined),
        [allowance, amount]
    )

    const {isSuccess} = useTransaction({hash})

    useEffect(() => {
        if (hash && isSuccess) {
            setTimeout(refetch, 1000)
        }
    }, [hash, isSuccess])

    const approve = useCallback(() => {
        try {
            if (spender) {
                // @ts-ignore
                writeContract({
                    ...contract,
                    functionName: 'approve',
                    args: [spender, MaxUint256.toString()]
                })
            }
            // return await contract?.approve(spender, MaxUint256)
        } catch (e) {
            console.error(e)
        }
    }, [token, contract, amount, spender])

    return {allowance, needsApprove, approve, hash, error, isPending}
}