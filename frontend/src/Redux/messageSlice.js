// import { createSlice } from '@reduxjs/toolkit';

// const messageSlice = createSlice({
//     name: 'message',
//     initialState: {
//         messages: [],
//     },
//     reducers: {
//         setMessages: (state, action) => {
//             state.messages = action.payload;
//         },
//         addMessage: (state, action) => {
//             state.messages.push(action.payload);
//         },
        

//     }
// });
// export const { setMessages, addMessage } = messageSlice.actions;
// export default messageSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const msg = state.messages.find((m) => m._id === messageId);
      if (msg) msg.status = status;
    }
  }
});

export const { setMessages, addMessage, updateMessageStatus } = messageSlice.actions;
export default messageSlice.reducer;
