import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: {
      isNovaWallet: boolean
      isMetaMask?: true
      on?: (...args: any[]) => void
      removeListener?: (...args: any[]) => void
      autoRefreshOnNetworkChange?: boolean
      providers: any[]
    }
    talismanEth?: any
    SubWallet?: any
    web3?: Record<string, unknown>
  }
}

export {}