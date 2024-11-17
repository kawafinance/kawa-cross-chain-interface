import {isTransactionRecent, useAllTransactions} from '../state/transactions/hooks'
import {useEffect, useMemo, useState} from 'react'

import {TransactionDetails} from '../state/transactions/reducer'

export enum TRANSACTION_STATUS {
    PENDING,
    FAILED,
    CONFIRMED
}

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
    return b.addedTime - a.addedTime
}

const useTransactionStatus = (hash) => {
    const [pendingTXStatus, setPendingTXStatus] = useState<any>(TRANSACTION_STATUS.PENDING)

    // Determine if change in transactions, if so, run query again
    const allTransactions = useAllTransactions()
    const tx = allTransactions[hash]
    // const sortedRecentTransactions = useMemo(() => {
    //     const txs = Object.values(allTransactions)
    //     return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    // }, [allTransactions])
    // const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
    // const hasPendingTransactions = !!pending.length

    useEffect(() => {
        if (hash && hash !== ''){
            if(!tx.receipt){
                setPendingTXStatus(TRANSACTION_STATUS.PENDING)
            }else if(tx.receipt.status){
                setPendingTXStatus(TRANSACTION_STATUS.CONFIRMED)
            }else {
                setPendingTXStatus(TRANSACTION_STATUS.FAILED)
            }
        } else {
            setPendingTXStatus(TRANSACTION_STATUS.PENDING)
        }

    }, [tx])

    return pendingTXStatus
}

export default useTransactionStatus
