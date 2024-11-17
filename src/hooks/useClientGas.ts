import {useEffect, useMemo} from "react";
import {useAccount, useReadContract} from 'wagmi';
import {useMarketContractConfig, useMessageHubContractConfig} from "./useContract.ts";
import {TYPES} from "../pages/panel";
import {ethers} from "ethers";


export function useMessageHubAddress(clientAddress: string): string {
    const marketContractConfig = useMarketContractConfig(clientAddress);
    // @ts-ignore
    const {data: messageHubAddress, refetch} = useReadContract({
        ...marketContractConfig,
        functionName: 'messageHub'
    });

    useEffect(() => {
        refetch();
    }, [marketContractConfig, refetch]);

    return messageHubAddress as string;
}

export default function useClientGas(clientAddress: string, type: string) {
    const {address} = useAccount()
    const messageHubAddress = useMessageHubAddress(clientAddress)
    const messageHubContractConfig = useMessageHubContractConfig(messageHubAddress)
    const abiCoder = new ethers.AbiCoder();
    const repayBorrowBehalfSignature = ethers.keccak256(
        ethers.toUtf8Bytes("repayBorrowBehalf(address,address,uint256)")
    ).slice(0, 10); // '0x' + 4 bytes
    const mintSignature = ethers.keccak256(
        ethers.toUtf8Bytes("mint(address,uint256)")
    ).slice(0, 10); // '0x' + 4 bytes

    const payload = {
        [TYPES.DEPOSIT]: abiCoder.encode(
            ['bytes4', 'address', 'uint256'],
            [mintSignature, address, ethers.MaxUint256]
        ),
        [TYPES.WITHDRAW]: abiCoder.encode(
            ['address', 'uint256'],
            [address, ethers.MaxUint256]
        ),
        [TYPES.BORROW]: abiCoder.encode(
            ['address', 'uint256'],
            [address, ethers.MaxUint256]
        ),
        [TYPES.REPAY]: abiCoder.encode(
            ['bytes4', 'address', 'address', 'uint256'],
            [repayBorrowBehalfSignature, address, address, ethers.MaxUint256]
        )
    }[type]

    // @ts-ignore
    const {data: gas, refetch} = useReadContract({
        ...messageHubContractConfig,
        functionName: 'gasEstimate',
        args: [payload, 2000]
    });
    useEffect(() => {
        refetch();
    }, [messageHubContractConfig, payload, refetch]);
    console.log(messageHubAddress, gas, payload)
    return gas ? gas  : BigInt(0)
}