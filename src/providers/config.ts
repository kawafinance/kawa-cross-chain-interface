import {createConfig, fallback, http} from "wagmi";
import {bscTestnet, sepolia} from "wagmi/chains";

export const wagmiConfig = createConfig({
    chains: [
        sepolia,
        bscTestnet
    ],
    transports: {
        [sepolia.id]: fallback([http('https://ethereum-sepolia-rpc.publicnode.com/')]),
        [bscTestnet.id]: http(),
    }
})

export const mainnetConfig = createConfig({
    chains: [
        sepolia
    ],
    transports: {
        [sepolia.id]: fallback([http('https://ethereum-sepolia-rpc.publicnode.com/')])
    }
})