
import chatReducer from './chatSlice'
import themeDataReducer from './themeSlice'
import { configureStore } from '@reduxjs/toolkit';



export const store = configureStore({
    reducer: {
        chat: chatReducer,
          themeData: themeDataReducer,




      },
      middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: true,
        serializableCheck: false,
        // other middleware options if needed
      }), 
    })


