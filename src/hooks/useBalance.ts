import {useMulticallContract, useTokenContract} from "./useContract";
import {useSingleContractMultipleData} from "../state/multicall/hooks";
import {useMemo} from "react";
import {useAccount} from "wagmi";

export function useSEIBalance(){
    const {address} = useAccount()
    const multicallContract = useMulticallContract()

    const results = useSingleContractMultipleData(
        multicallContract,
        'getEthBalance',
        address ? [[address]] : []
    )
    return useMemo( ()=>{
        return results?.[0]?.result ? results?.[0]?.result?.balance : 0
    }, [address, results])
}
export function useTokenBalance(tokenAddress){
    const {address} = useAccount()
    const tokenContract = useTokenContract(tokenAddress)

    const results = useSingleContractMultipleData(
        tokenContract,
        'balanceOf',
        address ? [[address]] : []
    )

    return useMemo( ()=>{
        return results?.[0]?.result ? results?.[0]?.result?.balance : 0
    }, [address, results])
}