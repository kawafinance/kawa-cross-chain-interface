import {Theme} from "@rainbow-me/rainbowkit";

export const customTheme: Theme = {
    blurs: {
        modalOverlay: "blur(2px)"
    },
    fonts: {
        body: "\"DM Sans\", sans-serif"
    },
    radii: {
        actionButton: "9999px",
        connectButton: "12px",
        menuButton: "12px",
        modal: "24px",
        modalMobile: "28px"
    },
    colors: {
        accentColor: "",
        accentColorForeground: "#FFF",
        actionButtonBorder: "rgba(255, 255, 255, 0.04)",
        actionButtonBorderMobile: "rgba(255, 255, 255, 0.08)",
        actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.08)",
        closeButton: "rgba(224, 232, 255, 0.6)",
        closeButtonBackground: "rgba(255, 255, 255, 0.08)",
        connectButtonBackground: "",
        connectButtonBackgroundError: "linear-gradient(to right, #CCFFB4, #72B3FF)",
        connectButtonInnerBackground: "linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))",
        connectButtonText: "#FFF",
        connectButtonTextError: "rgba(0, 0, 0, 0.75)",
        connectionIndicator: "#30E000",
        downloadBottomCardBackground: "linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.2) 71.04%), #2A2C34",
        downloadTopCardBackground: "linear-gradient(126deg, rgba(120, 120, 120, 0.2) 9.49%, rgba(0, 0, 0, 0) 71.04%), #2A2C34",
        error: "#FF494A",
        generalBorder: "rgba(255, 255, 255, 0.08)",
        // eneralBorderDim: "rgba(255, 255, 255, 0.04)",
        menuItemBackground: "rgba(224, 232, 255, 0.1)",
        modalBackdrop: "rgba(0, 0, 0, 0.5)",
        modalBackground: "#2A2C34",
        modalBorder: "", //"linear-gradient(to right, #CCFFB4, #72B3FF) 1",
        modalText: "#FFF",
        // odalTextDim: "rgba(224, 232, 255, 0.3)",
        modalTextSecondary: "rgba(255, 255, 255, 0.6)",
        profileAction: "rgba(224, 232, 255, 0.1)",
        profileActionHover: "rgba(224, 232, 255, 0.2)",
        profileForeground: "rgba(224, 232, 255, 0.05)",
        selectedOptionBorder: "rgba(224, 232, 255, 0.1)",
        standby: "#FFD641",
        generalBorderDim: "",
        modalTextDim: ""
    },
    shadows: {
        connectButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
        profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
        selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
        selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.24)",
        walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)"
    }
}