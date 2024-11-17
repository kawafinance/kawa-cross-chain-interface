import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from "@apollo/client";
import {ChainId} from "../../constants/chains";

const graphURI = {
    [ChainId.MAINNET]: 'https://api.studio.thegraph.com/query/73277/kawa-sei-mainnet/v0.0.5',
    [ChainId.TESTNET]: 'https://api.studio.thegraph.com/query/73277/kawa-sei-testnet/version/latest',
    [ChainId.DEVNET]: 'https://api.studio.thegraph.com/query/73277/kawa-sei-devnet/version/latest',

}

const apolloClient = new ApolloClient({
    link: new ApolloLink((operation, forward) => {
        const { chainId } = operation.getContext();
        const chain = chainId in ChainId ? chainId : ChainId.MAINNET
        const selectedLink = new HttpLink({ uri: graphURI[chain]})
        return selectedLink.request(operation, forward);
    }),
    cache: new InMemoryCache()
});

export default apolloClient