import {createConfig, fallback, http} from "wagmi";
import {bscTestnet, sepolia, seiDevnet} from "wagmi/chains";

export const wagmiConfig = createConfig({
    chains: [
        seiDevnet,
        sepolia,
        bscTestnet
    ],
    transports: {
        [seiDevnet.id]: http(),
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