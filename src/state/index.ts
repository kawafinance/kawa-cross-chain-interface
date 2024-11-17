import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  createAction
} from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import multicall from './multicall/reducer'
import transactions from './transactions/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'bridgeTransactions']

const reducer = combineReducers({
  application,
  multicall,
  transactions
})

export const updateVersion = createAction<void>('global/updateVersion')

const store = configureStore({
  reducer,
  // reducer: persistReducer(persistConfig, reducer),
  middleware: getDefaultMiddleware({
    thunk: true,
    immutableCheck: true,
  }).concat(save({ states: PERSISTED_KEYS, debounce: 1000, disableWarnings: true })),
  devTools: process.env.NODE_ENV === 'development',
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: true }),
})

store.dispatch(updateVersion())

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store
