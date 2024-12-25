import {ChainId} from "../constants/chains.ts";

export function getExplorerLink (hash: string, chainId: ChainId | undefined, type: string): string {

    const network = chainId === ChainId.DEVNET ? '?chain=arctic-1' : ''
    if (type === 'transaction'){
        if(chainId === ChainId.SEPOLIA){
            return `https://sepolia.etherscan.io/tx/${hash}${network}`
        }else if(chainId === ChainId.BSC_TESTNET){
            return `https://testnet.bscscan.com/tx/${hash}${network}`
        }
        return `https://seitrace.com/tx/${hash}${network}`
    } else if (type === 'address'){
        return `https://seitrace.com/address/${hash}${network}`
    }
    return ''
}

export function getAxelarLink (hash: string): string {
    return `https://testnet.axelarscan.io/gmp/${hash}`
}

export function getLayerZeroLink (hash: string): string {
    return `https://testnet.layerzeroscan.com/tx/${hash}`
}



// todo check if done properly
