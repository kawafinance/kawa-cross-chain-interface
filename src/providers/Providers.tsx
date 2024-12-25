import {createConfig, http, WagmiProvider, fallback} from "wagmi";
import apolloClient from "../services/apollo/client.ts";
import {RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {customTheme} from "../styles/rainbowkitTheme.ts";
import "@rainbow-me/rainbowkit/styles.css";
import {ApolloProvider} from "@apollo/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {wagmiConfig} from "./config.ts";

const queryClient = new QueryClient();

const Providers = ({children}) => {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <ApolloProvider client={apolloClient}>
                    <RainbowKitProvider
                        modalSize="compact"
                        showRecentTransactions={true}
                        theme={customTheme}
                    >
                        {children}
                    </RainbowKitProvider>
                </ApolloProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default Providers