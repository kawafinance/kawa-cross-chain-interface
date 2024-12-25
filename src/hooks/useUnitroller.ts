
import { useCallback } from 'react'
import { useUnitrollerContractConfig} from "./useContractConfig.ts";
import {useAccount, useWriteContract} from "wagmi";

export default function useUnitroller() {
  const account = useAccount()
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

  const contract = useUnitrollerContractConfig()

  const enterMarkets = useCallback(
    (address: any) => {
      try {
          // @ts-ignore
          writeContract({
              ...contract,
              functionName: 'enterMarkets',
              args: [[address]]
          })
        // return await contract?.enterMarkets([address])
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const exitMarket = useCallback(
    (address: any) => {
      try {
          // @ts-ignore
          writeContract({
              ...contract,
              functionName: 'exitMarket',
              args: [address]
          })
        // return await contract?.exitMarket(address)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const claimReward = useCallback(
    (rewardType: number) => {
      try {
          if(account.address) {
              // @ts-ignore
              writeContract({
                  ...contract,
                  functionName: 'claimReward',
                  args: [rewardType, account.address]
              })
          }
        // return await contract?.claimReward(rewardType, account.address)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  return { enterMarkets, exitMarket, claimReward, hash, error, isPending }
}