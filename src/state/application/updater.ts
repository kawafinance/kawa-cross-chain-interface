import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import {useBlockNumber, useChainId} from "wagmi";

export default function Updater(): null {
  const chainId = useChainId()
  const dispatch = useDispatch()

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{
    chainId: number | undefined
    blockNumber: number | null
  }>({
    chainId,
    blockNumber: null,
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return {
            chainId,
            blockNumber: Math.max(blockNumber, state.blockNumber),
          }
        }
        return state
      })
    },
    [chainId, setState]
  )
  const {data: blockNumber} = useBlockNumber({
    watch: true,
  })
  // attach/detach listeners
  useEffect(() => {
    if (!blockNumber || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })
    blockNumberCallback(Number(blockNumber))
    // library
    //   .getBlockNumber()
    //   .then(blockNumberCallback)
    //   .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))
    //
    // library.on('block', blockNumberCallback)
    // return () => {
    //   library.removeListener('block', blockNumberCallback)
    // }
  }, [dispatch, chainId, blockNumber, blockNumberCallback, windowVisible])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(
      updateBlockNumber({
        chainId: debouncedState.chainId,
        blockNumber: debouncedState.blockNumber,
      })
    )
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}
