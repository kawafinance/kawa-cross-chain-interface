import gql from 'graphql-tag'

export const marketDailySnapshots = gql`
    query marketDailySnapshots($timestamp_gt: Int!, $first: Int!, $skip: Int!) {
        marketDailySnapshots(
            orderBy: timestamp,
            where: { timestamp_gt: $timestamp_gt },
            first: $first,
            skip: $skip
        ) {
            id
            totalBorrows
            totalBorrowsUSD
            totalSupplies
            totalSuppliesUSD
            timestamp
            market {
                id
                symbol
            }
        }
    }
`

export const leaderboardQuery = gql`
    query leaderboardQuery($first: Int!, $skip: Int!) {
        accounts(
            first: $first,
            skip: $skip
        ) {
            tokens {
                symbol
                pointsBorrowed
                pointsSupplied
                pointsSeiyanLP
            }
            id
        }
    }
`