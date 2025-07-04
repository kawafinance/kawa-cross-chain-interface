// NOTE: Try not to add anything to thie file, it's almost entirely refactored out.

import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'

import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { isAddress } from './validate'
import {MARKETS, NATIVE_CHAIN_ID} from "../constants/contracts.ts";

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, signerOrProvider: any): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, signerOrProvider)
}

export function isNative(address: string): boolean {
  return address == MARKETS.find(r => r.chainId == NATIVE_CHAIN_ID)?.id
}