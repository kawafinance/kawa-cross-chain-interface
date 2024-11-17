import {ChainId} from "./chains";

type AssetInfo = {
    id: string
    name: string
    symbol: string
    decimals: number
    chainId: ChainId,
    client: string
}

// export type AddressMapForLend = {
//     [chainId: number]: AssetInfo[]
// }
export const NATIVE_TOKEN = 'ETH'
export const NATIVE_CHAIN_ID = ChainId.SEPOLIA

export const MARKETS: AssetInfo[] = [
    {
        id: '0xd7e36BCd92295723895E8363A8B0F1350A2cc582',
        name: 'Kawa ETH',
        symbol: 'kETH',
        decimals: 8,
        chainId: ChainId.SEPOLIA,
        client: ''
    },
    {
        id: '0x9eB4Bd434E74fD8a75DBD3274f0d95c54F7835a2',
        name: 'Kawa BNB',
        symbol: 'kBNB',
        decimals: 8,
        chainId: ChainId.BSC_TESTNET,
        client: '0x37eF1d6862bD25f9046EC564c11a4D5ae0E598Ff'
    }
]

export const WETH_ROUTER_ADDRESS = '0x29F87588327592de67174A701A02bcb7170c02E6'

export const UNITROLLER_ADDRESS = '0x9627AC216A16bd1680A8b5EA3C3D226D1688672A'

export const PYTH_ORACLE_ADDRESS = '0xa34dd78B64bcFDc4e4cA816696528A436B399C90'

export const MULTICALL_ADDRESS = {
    [ChainId.SEPOLIA]: '0x0eE06C8Cfc581B6516De12Ec05350fe43584901f',
}

export const LOCKZAP_ADDRESS = {
    [ChainId.SEPOLIA]: '',
}

export const INCENTIVES_DISTRIBUTOR_ADDRESS = {
    [ChainId.SEPOLIA]: '',
}

export const INCENTIVES_CONTROLLER_ADDRESS = {
    [ChainId.SEPOLIA]: '',
}

export const INCENTIVES_ELIGIBILITY_ADDRESS = {
    [ChainId.SEPOLIA]: '',
}

export const PRICE_PROVIDER_ADDRESS = {
    [ChainId.SEPOLIA]: '',
}

export const KAWA_TOKEN_ADDRESS = {
    [ChainId.SEPOLIA]: '',
}