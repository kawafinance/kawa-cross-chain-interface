import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { coinbase } from '../connectors'

function useEagerConnect(connector: any) {
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)

  useEffect(() => {
    if(connector === coinbase){
      activate(connector, undefined, true).then().catch(() => {
        const walletInfo = localStorage.getItem('walletConnected')
        if (walletInfo) {
          localStorage.removeItem('walletConnected')
        }
        setTried(true)
      })
    // } else if( connector === uauth){
    //   activate(connector, undefined, true).catch(() => {
    //     const walletInfo = localStorage.getItem('walletConnected')
    //     if (walletInfo) {
    //       localStorage.removeItem('walletConnected')
    //     }
    //     setTried(true)
    //   })
    } else {
    connector.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(connector, undefined, true).catch(() => {
          const walletInfo = localStorage.getItem('walletConnected')
          if (walletInfo) {
            localStorage.removeItem('walletConnected')
          }
          setTried(true)
        })
      } else {
        if (isMobile && window.ethereum) {
          activate(connector, undefined, true).catch(() => {
            const walletInfo = localStorage.getItem('walletConnected')
            if (walletInfo) {
              localStorage.removeItem('walletConnected')
            }
            setTried(true)
          })
        } else {
          setTried(true)
        }
      }
    })
  }
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

export default useEagerConnect
