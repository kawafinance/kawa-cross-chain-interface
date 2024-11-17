type AssetMultiplier = {
    [id: string]: {
        supply: number,
        borrow: number
    }
}

export const MULTIPLIERS: AssetMultiplier = {
    SEI: {
        supply: 1.5,
        borrow: 2.5
    },
    USDC: {
        supply: 1.1,
        borrow: 2.0
    },
    USDT: {
        supply: 1.1,
        borrow: 2.0
    },
    ETH: {
        supply: 1.1,
        borrow: 2.0
    },
    BNB: {
        supply: 1.1,
        borrow: 2.0
    }
}