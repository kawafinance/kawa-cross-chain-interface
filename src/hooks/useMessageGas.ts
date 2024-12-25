import {useEffect, useMemo} from "react";
import {useAccount, useReadContract} from 'wagmi';
import {useCentralHubContractConfig, useMarketContractConfig} from "./useContract.ts";
import {TYPES} from "../pages/panel";
import {ethers} from "ethers";


export function useCentralHubAddress(clientAddress: string): string {
    const marketContractConfig = useMarketContractConfig(clientAddress);
    // @ts-ignore
    const {data: centralHubAddress, refetch} = useReadContract({
        ...marketContractConfig,
        functionName: 'centralHub'
    });

    useEffect(() => {
        refetch();
    }, [marketContractConfig, refetch]);

    return centralHubAddress as string;
}

export default function useMessageGas(clientAddress: string, type: string): bigint {
    const {address} = useAccount()
    const centralHubAddress = useCentralHubAddress(clientAddress)
    const centralHubContractConfig = useCentralHubContractConfig(centralHubAddress)

    // The payload the contracts send to CentralHub (different from the external function calls)

    const abiCoder = new ethers.AbiCoder();
    const repayBorrowBehalfSignature = ethers.keccak256(
        ethers.toUtf8Bytes("repayBorrowBehalf(address,address,uint256)")
    ).slice(0, 10); // '0x' + 4 bytes
    const mintSignature = ethers.keccak256(
        ethers.toUtf8Bytes("mint(address,uint256)")
    ).slice(0, 10); // '0x' + 4 bytes
    const releaseETHSignature = ethers.keccak256(
        ethers.toUtf8Bytes("releaseETH(address,uint)")
    ).slice(0, 10); // '0x' + 4 bytes
    const payload = {
        [TYPES.DEPOSIT]: abiCoder.encode(
            ['bytes4', 'address', 'uint256'],
            [mintSignature, address, ethers.MaxUint256]
        ),
        [TYPES.WITHDRAW]: abiCoder.encode(
            ['bytes4', 'address', 'uint256'],
            [releaseETHSignature, address, ethers.MaxUint256]
        ),
        [TYPES.BORROW]: abiCoder.encode(
            ['bytes4', 'address', 'uint256'],
            [releaseETHSignature, address, ethers.MaxUint256]
        ),
        [TYPES.REPAY]: abiCoder.encode(
            ['bytes4', 'address', 'address', 'uint256'],
            [repayBorrowBehalfSignature, address, address, ethers.MaxUint256]
        )
    }[type]

    // @ts-ignore
    const {data: gas, refetch} = useReadContract({
        ...centralHubContractConfig,
        functionName: 'calculateGas',
        args: [payload]
    });
    useEffect(() => {
        refetch();
    }, [centralHubContractConfig, payload, refetch]);

    return gas ? gas as bigint : BigInt(0)
}