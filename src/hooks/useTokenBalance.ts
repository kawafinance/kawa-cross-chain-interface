import {useMemo} from "react";
import {useAccount, useReadContracts} from "wagmi";
import {erc20Abi} from "viem";

export function useTokenBalance(tokenAddress){
    const {address} = useAccount()

    const results = useReadContracts({
        contracts: [
            {
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [address!],
            }
        ]
    })

    return useMemo( ()=>{
        return results?.[0]?.result ? results?.[0]?.result?.balance : 0
    }, [address, results])
}