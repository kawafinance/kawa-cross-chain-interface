import { AbstractConnector } from '@web3-react/abstract-connector'
import {injected} from "../connectors";

export interface WalletInfo {
    connector?: (() => Promise<AbstractConnector>) | AbstractConnector
    name: string
    iconName: string
    description: string
    href: string | null
    color: string
    primary?: boolean
    mobile?: boolean
    mobileOnly?: boolean
    isNovaWallet?: boolean
}

export const NetworkContextName = 'NETWORK'
export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    // INJECTED: {
    //     connector: injected,
    //     name: 'Injected',
    //     iconName: 'injected.svg',
    //     description: 'Injected web3 provider.',
    //     href: null,
    //     color: '#010101',
    //     primary: true
    // },
    METAMASK: {
        connector: injected,
        name: 'MetaMask',
        iconName: 'metamask.png',
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D'
    },
    // Seif: {
    //     connector: seif,
    //     name: 'Seif',
    //     iconName: 'seif.svg',
    //     description: 'Use Seif Wallet.',
    //     href: null,
    //     color: '#fff'
    // }
    // Talisman: {
    //     connector: talisman,
    //     name: 'Talisman',
    //     iconName: 'talisman.png',
    //     description: 'Use Talisman Wallet.',
    //     href: null,
    //     color: '#010101',
    //     primary: true
    // },
    // Subwallet: {
    //     connector: subwallet,
    //     name: 'SubWallet',
    //     iconName: 'subwallet.png',
    //     description: 'Use Subwallet Wallet.',
    //     href: null,
    //     color: '#010101',
    //     primary: true
    // },
    // Coinbase: {
    //     connector: coinbase,
    //     name: 'Coinbase',
    //     iconName: 'coinbase.png',
    //     description: 'Use Coinbase Wallet.',
    //     href: null,
    //     color: '#010101',
    //     mobile: true,
    //     primary: true,
    // },
    // NOVA_WALLET: {
    //     connector: injectedNova,
    //     name: 'Nova Wallet',
    //     iconName: 'nova.png',
    //     description: 'Connect to Nova Wallet',
    //     href: null,
    //     color: '#4196FC',
    //     mobile: true,
    //     isNovaWallet: true,
    //     mobileOnly: true
    // },
    // UNSTOPPABLE: {
    //     connector: uauth,
    //     name: 'Unstoppable Domains',
    //     iconName: 'unstoppable.png',
    //     description: 'Connect to Unstoppable Domains',
    //     href: null,
    //     color: '#4196FC',
    //     mobile: true
    // },
    // WALLET_CONNECT: {
    //     connector: walletconnect,
    //     name: 'WalletConnect',
    //     iconName: 'wallet-connect.svg',
    //     description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    //     href: null,
    //     color: '#4196FC',
    //     mobile: true
    // }
    // TRUST_WALLET: {
    //   connector: injected,
    //   name: 'Trust Wallet',
    //   iconName: 'trustwallet.svg',
    //   description: 'The most trusted & secure crypto wallet.',
    //   href: null,
    //   color: '#3688EB',
    //   mobile: true,
    // },
    // LATTICE: {
    //   connector: async () => {
    //     const LatticeConnector = (await import('@web3-react/lattice-connector')).LatticeConnector
    //     return new LatticeConnector({
    //       chainId: 1,
    //       url: RPC[ChainId.MAINNET],
    //       appName: 'SushiSwap',
    //     })
    //   },
    //   name: 'Lattice',
    //   iconName: 'lattice.png',
    //   description: 'Connect to GridPlus Wallet.',
    //   href: null,
    //   color: '#40a9ff',
    //   mobile: true,
    // },
    // WALLET_LINK: {
    //   connector: walletlink,
    //   name: 'Coinbase Wallet',
    //   iconName: 'coinbase.svg',
    //   description: 'Use Coinbase Wallet app on mobile device',
    //   href: null,
    //   color: '#315CF5',
    // },
    // COINBASE_LINK: {
    //   name: 'Open in Coinbase Wallet',
    //   iconName: 'coinbase.svg',
    //   description: 'Open in Coinbase Wallet app.',
    //   href: 'https://go.cb-w.com',
    //   color: '#315CF5',
    //   mobile: true,
    //   mobileOnly: true,
    // },
    // FORTMATIC: {
    //   connector: fortmatic,
    //   name: 'Fortmatic',
    //   iconName: 'fortmatic.png',
    //   description: 'Login using Fortmatic hosted wallet',
    //   href: null,
    //   color: '#6748FF',
    //   mobile: true,
    // },
    // Portis: {
    //   connector: portis,
    //   name: 'Portis',
    //   iconName: 'portis.png',
    //   description: 'Login using Portis hosted wallet',
    //   href: null,
    //   color: '#4A6C9B',
    //   mobile: true,
    // },
    // Torus: {
    //   connector: torus,
    //   name: 'Torus',
    //   iconName: 'torus.png',
    //   description: 'Login using Torus hosted wallet',
    //   href: null,
    //   color: '#315CF5',
    //   mobile: true,
    // },
    // Binance: {
    //   connector: binance,
    //   name: 'Binance',
    //   iconName: 'bsc.jpg',
    //   description: 'Login using Binance hosted wallet',
    //   href: null,
    //   color: '#F0B90B',
    //   mobile: false,
    // },
}
