
import chatReducer from './chat/reducers'
import { configureStore } from '@reduxjs/toolkit';



export const store = configureStore({
    reducer: {
        chat: chatReducer,

      },
      middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: true,
        serializableCheck: false,
        // other middleware options if needed
      }), 
    })
