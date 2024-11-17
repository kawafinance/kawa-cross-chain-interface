// import { injected, talisman, subwallet, injectedNova } from '../connectors';

function walletConnected(name: string) {
  try {
    const walletInfo = localStorage.getItem('walletConnected')
    if (walletInfo) {
      localStorage.removeItem('walletConnected')
    }

    if(name === ''){
      return false
    }
    const isMetaMask = {isMetaMask: name === 'MetaMask' || name === 'WalletConnect'}
    const isSeif = {isSeif: name === 'Seif'}
    const isWalletConnect = {isMetaMask: name === 'WalletConnect'}
    const isTalisman = {isTalisman: name === 'Talisman'}
    const isSubWallet = {isSubWallet: name === 'SubWallet'}
    const isCoinbase = {isCoinbase: name === 'Coinbase'}
    const isNovaWallet = {isNovaWallet: name === 'Nova Wallet'}
    const isUD = {isUD: name === 'Unstoppable Domains'}

    localStorage.setItem(
      'walletConnected',
      JSON.stringify({
        ...isMetaMask,
        ...isSeif,
        ...isWalletConnect,
        ...isTalisman,
        ...isSubWallet,
        ...isCoinbase,
        ...isNovaWallet,
        ...isUD
      })
    )
    return;
  } catch(err) {
    console.log('An error occurred when tried to access localstorage Err: ', err)
  }
}

export default walletConnected
