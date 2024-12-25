import {useEffect, useState} from "react";
import {ChainId} from "../constants/chains.ts";
import {useAccount, useChainId} from "wagmi";
import {useEthersProvider} from "./useSignerOrProvider.ts";

export function useSeiAddress() {
    // const chainId = useChainId()
    const {address} = useAccount()
    // const [seiAddress, setSeiAddress] = useState(undefined)
    // const [loading, setLoading] = useState(true)
    // const provider = useEthersProvider()
    //
    // useEffect(() => {
    //     // todo check testnet
    //     setLoading(true)
    //     setSeiAddress(undefined)
    //     if (provider && address && chainId && chainId in ChainId) {
    //         provider
    //             .send(
    //                 'sei_getSeiAddress',
    //                 [address]
    //             )
    //             .then(r => {
    //                 setSeiAddress(r)
    //                 setLoading(false)
    //             })
    //             .catch(e => {
    //                 if (e.error.code !== -32000){ // -32000 failed to find sei address expected, log otherwise
    //                     console.log(e)
    //                 }
    //                 setSeiAddress(undefined)
    //                 setLoading(false)
    //             })
    //     }
    // }, [chainId, address])
    //
    return {seiAddress: address, loading: false}
}