import {
    MULTICALL_ADDRESS,
    PRICE_PROVIDER_ADDRESS,
    PYTH_ORACLE_ADDRESS,
    UNITROLLER_ADDRESS,
    WETH_ROUTER_ADDRESS
} from "../constants/contracts.ts";
import {useMemo} from "react";
import {getContract, isNative} from "../utils/contract";
import COMPTROLLER_ABI from '../constants/abis/comptroller.json'
import MARKET_ABI from '../constants/abis/market.json'
import KCLIENT_ABI from '../constants/abis/kclient.json'
import KERC20CROSSCHAIN_ABI from '../constants/abis/kerc20crosschain.json'
import KWETHDELEGATE_ABI from '../constants/abis/kWethDelegate.json'
import WETHROUTER_ABI from '../constants/abis/wethRouter.json'
import PYTH_ORACLE_ABI from '../constants/abis/pythOracle.json'
import MULTICALL_ABI from '../constants/abis/multicall.json'
import PRICE_PROVIDER_ABI from '../constants/abis/priceProvider.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import CENTRALHUB_ABI from '../constants/abis/centralHub.json'
import {useAccount, useChainId} from "wagmi";

export type ContractConfig = {
    abi: any;
    address: string;
}

export function useUnitrollerContractConfig(): ContractConfig {
    const chainId = useChainId()
    return {
        abi: COMPTROLLER_ABI,
        address: UNITROLLER_ADDRESS
    } as const
}

export function useMarketContractConfig(
    tokenAddress?: string,
    isClient?: boolean,
): ContractConfig {
    const abi = isNative(tokenAddress!)
        ? KWETHDELEGATE_ABI
        : isClient
            ? KCLIENT_ABI
            : KERC20CROSSCHAIN_ABI

    return {
        abi,
        address: tokenAddress ?? ''
    } as const
}

export function useCentralHubContractConfig(
    CentralHubAddress?: string
): ContractConfig {
    return {
        abi: CENTRALHUB_ABI,
        address: CentralHubAddress ?? ''
    } as const
}

export function useWEthRouterContractConfig(): ContractConfig {
    return {
        abi: WETHROUTER_ABI,
        address: WETH_ROUTER_ADDRESS
    } as const
}

export function usePythOracleContractConfig(): ContractConfig {
    return {
        abi: PYTH_ORACLE_ABI,
        address: PYTH_ORACLE_ADDRESS
    } as const
}

export function useTokenContractConfig(address: string): ContractConfig {
    return {
        abi: ERC20_ABI,
        address
    }
}

