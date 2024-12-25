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
export const NATIVE_TOKEN = 'SEI'
export const NATIVE_CHAIN_ID = ChainId.DEVNET

export const MARKETS: AssetInfo[] = [
    {
        id: '0xF4b1a17336aFFb8DED9204eAE8F5CcdB93ae3473',
        name: 'Kawa SEI',
        symbol: 'kSEI',
        decimals: 8,
        chainId: ChainId.DEVNET,
        client: ''
    },
    {
        id: '0x38C4Fe1f9c265be237104eb7Fbe5CdE08b004844',
        name: 'Kawa ETH',
        symbol: 'kETH',
        decimals: 8,
        chainId: ChainId.SEPOLIA,
        client: '0x2515eF84170495D8dA03071a181E8aFd6D3cA4b5'
    },
    {
        id: '0xee26d43c14A3195E7d3a222e8489914b06202924',
        name: 'Kawa BNB',
        symbol: 'kBNB',
        decimals: 8,
        chainId: ChainId.BSC_TESTNET,
        client: '0xD6a1489a092570B57B02EdA744c37510553f212c'
    }
]

export const WETH_ROUTER_ADDRESS = '0x28bF3c063eB78744041C325d6DE688A78a34B3Fb'

export const UNITROLLER_ADDRESS = '0x1c0672AC8e6549d8E6429EEa02546e25ef1cA7E9'

export const PYTH_ORACLE_ADDRESS = '0xe079c5E970194aD1AADA4fd58aa6A9B6a7518A37'

export const MULTICALL_ADDRESS = {
    [ChainId.MAINNET]: '0x8ffB52e5E936F88e27a352B13B4e0A09cF254bea',
    [ChainId.TESTNET]: '0x8bE60909663495D02e268C804e2A2BcA43c03b60',
    [ChainId.DEVNET]: '0x2d929b6738865FE61DD5C2A591802228B720DD97',
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