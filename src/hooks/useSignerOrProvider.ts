import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import {type Config, useChainId, useClient, useConnectorClient} from 'wagmi'
import {JsonRpcProvider, JsonRpcSigner} from "@ethersproject/providers";

export function clientToProvider(client: Client<Transport, Chain>) {
    const { chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    if (transport.type === 'fallback') {
        const providers = (transport.transports as ReturnType<Transport>[]).map(
            ({ value }) => new JsonRpcProvider(value?.url, network),
        )
        if (providers.length === 1) return providers[0]
        // return new FallbackProvider(providers)
    }
    return new JsonRpcProvider(chain.rpcUrls.default.http[0], network)
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider() {
    const chainId = useChainId()
    const client = useClient<Config>({ chainId })
    return useMemo(() => (client ? clientToProvider(client) : undefined), [client])
}