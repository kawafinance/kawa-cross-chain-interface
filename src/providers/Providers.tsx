import {createConfig, http, WagmiProvider, fallback} from "wagmi";
import apolloClient from "../services/apollo/client.ts";
import {RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {customTheme} from "../styles/rainbowkitTheme.ts";
import "@rainbow-me/rainbowkit/styles.css";
import {ApolloProvider} from "@apollo/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider as ReduxProvider} from 'react-redux'
import store from '../state'
import MulticallUpdater from '../state/multicall/updater.tsx'
import ApplicationUpdater from '../state/application/updater.ts'
import {wagmiConfig} from "./config.ts";

const queryClient = new QueryClient();

const Providers = ({children}) => {
    return (
        <WagmiProvider config={wagmiConfig}>
            <ReduxProvider store={store}>
                <QueryClientProvider client={queryClient}>
                    <ApolloProvider client={apolloClient}>
                        <RainbowKitProvider
                            modalSize="compact"
                            showRecentTransactions={true}
                            theme={customTheme}
                        >
                            <>
                                <ApplicationUpdater/>
                                <MulticallUpdater/>
                            </>
                            {children}
                        </RainbowKitProvider>
                    </ApolloProvider>
                </QueryClientProvider>
            </ReduxProvider>
        </WagmiProvider>
    )
}

export default Providers