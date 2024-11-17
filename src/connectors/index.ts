import { Web3Provider } from '@ethersproject/providers'
// import {UAuthConnector} from '@uauth/web3-react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from './NetworkConnector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import {ChainId} from "../constants/chains";
import { injected as injectedWagmi} from "wagmi/connectors";

export const RPC = {
  [ChainId.DEVNET]: 'https://evm-rpc-arctic-1.sei-apis.com',
  [ChainId.MAINNET]: 'https://evm-rpc.sei-apis.com'
// https://evm-rpc.arctic-1.seinetwork.io,
}

export const network = new NetworkConnector({
  defaultChainId: 1329,
  urls: RPC,
})

let networkLibrary: Web3Provider | undefined

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

function getExplicitInjectedProvider() {
  if (typeof window === "undefined") return;
  if (window.ethereum && window.ethereum["__seif"]) {
    return window.ethereum;
  }

  if ((window as any)["__seif"]) {
    return (window as any)["__seif"];
  }

  return undefined;
}

export const injected = new InjectedConnector({
  supportedChainIds: [
    ChainId.MAINNET,
    ChainId.DEVNET
  ]
})

// export const seif = injectedWagmi({
//     id: 'seif',
//     name: 'Seif',
//     provider: getExplicitInjectedProvider(),
//   }
// )

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [ChainId.MAINNET]: RPC[ChainId.MAINNET]
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
})

export const coinbase = new WalletLinkConnector({
  url: RPC[ChainId.MAINNET],
  appName: "WalletLink Connector (Coinbase)",
  supportedChainIds: [
    ChainId.MAINNET
  ],
 });

 export const injectedNova = new InjectedConnector({
  supportedChainIds: [
    ChainId.MAINNET
  ]
})

// export const uauth = new UAuthConnector({
//   clientID: "43a4b90e-9963-4406-bdaf-d12c46678a0e",
//   redirectUri: "https://app.solarbeam.io/exchange/swap",
//   // postLogoutRedirectUri: "http://localhost:8000",
//   // Scope must include openid and wallet
//   scope: 'openid wallet',
//
//   // Injected and walletconnect connectors are required.
//   connectors: {injected, walletconnect},
// })