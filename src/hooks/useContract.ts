import {Contract} from '@ethersproject/contracts'
import {
    MULTICALL_ADDRESS, PRICE_PROVIDER_ADDRESS,
    PYTH_ORACLE_ADDRESS,
    UNITROLLER_ADDRESS,
    WETH_ROUTER_ADDRESS
} from "../constants/contracts.ts";
import {useMemo} from "react";
import {getContract, isNative} from "../utils/contract";
import COMPTROLLER_ABI from '../constants/abis/comptroller.json'
import MARKET_ABI from '../constants/abis/market.json'
import KWETHDELEGATE_ABI from '../constants/abis/kWethDelegate.json'
import WETHROUTER_ABI from '../constants/abis/wethRouter.json'
import PYTH_ORACLE_ABI from '../constants/abis/pythOracle.json'
import MULTICALL_ABI from '../constants/abis/multicall.json'
import PRICE_PROVIDER_ABI from '../constants/abis/priceProvider.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import MESSAGE_HUB_ABI from '../constants/abis/messageHub.json'
import {useAccount, useChainId} from "wagmi";
import {useEthersProvider, useEthersSigner } from "./useSignerOrProvider.ts";

export type ContractConfig = {
    abi: any;
    address: string;
}

export function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
    const account = useAccount()
    const signer = useEthersSigner()
    const provider = useEthersProvider()

    return useMemo(() => {
        if (!address || !ABI) return null
        try {
            return getContract(address, ABI, withSignerIfPossible ? signer : provider)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, signer, provider, withSignerIfPossible, account])
}

export function useUnitrollerContract(withSignerIfPossible?: boolean): Contract | null {
    const chainId = useChainId()
    return useContract(UNITROLLER_ADDRESS[chainId!], COMPTROLLER_ABI, withSignerIfPossible)
}

export function useUnitrollerContractConfig(): ContractConfig {
    const chainId = useChainId()
    return {
        abi: COMPTROLLER_ABI,
        address: UNITROLLER_ADDRESS
    } as const
}

export function usePriceProviderContract(): Contract | null {
    const chainId = useChainId()
    return useContract(PRICE_PROVIDER_ADDRESS[chainId!], PRICE_PROVIDER_ABI, false)
}

export function useMarketContractConfig(
    tokenAddress?: string
): ContractConfig {
    const abi = isNative(tokenAddress!) ? KWETHDELEGATE_ABI : MARKET_ABI
    return {
        abi,
        address: tokenAddress ?? ''
    } as const
}

export function useMessageHubContractConfig(
    messageHubAddress?: string
): ContractConfig {
    return {
        abi: MESSAGE_HUB_ABI,
        address: messageHubAddress ?? ''
    } as const
}

export function useWEthRouterContractConfig(): ContractConfig {
    return {
        abi: WETHROUTER_ABI,
        address: WETH_ROUTER_ADDRESS
    } as const
}

export function usePythOracleContract(): Contract | null {
    const chainId = useChainId()
    return useContract(PYTH_ORACLE_ADDRESS[chainId!], PYTH_ORACLE_ABI, false)
}

export function usePythOracleContractConfig(): ContractConfig {
    return {
        abi: PYTH_ORACLE_ABI,
        address: PYTH_ORACLE_ADDRESS
    } as const
}

export function useMulticallContract(): Contract | null {
    const chainId = useChainId()
    return useContract(chainId && MULTICALL_ADDRESS[chainId!], MULTICALL_ABI, false)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useTokenContractConfig(address: string): ContractConfig {
    return {
        abi: ERC20_ABI,
        address
    }
}

