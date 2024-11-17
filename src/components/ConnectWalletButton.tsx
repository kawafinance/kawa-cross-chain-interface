import React, {useEffect} from "react";
import {ConnectButton} from "@rainbow-me/rainbowkit";

const ConnectWalletButton = () => {
    // useEffect(() => {
    //     const buttons = document.querySelectorAll('[data-testid="connect-wallet"]');
    //     buttons.forEach(button => {
    //         if (button) {
    //             button.textContent = 'Connect Wallet';
    //         }
    //     });
    // }, []);

    return (
        <div className={'bg-gradient-to-r from-beam-primary-300 to-sky-blue p-[1px] rounded'}>
            <div className={'w-full h-full bg-neutral-700 rounded'}>
                <ConnectButton
                    label={'Connect to a wallet'}
                    // chainStatus={"full"}
                    accountStatus={"address"}
                />
            </div>
        </div>
    )
}

export default ConnectWalletButton