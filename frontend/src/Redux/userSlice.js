import {createSlice} from "@reduxjs/toolkit"
import otherUser from "../components/OtherUser";
import { act } from "react";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        authUser : null,
        otherUsers :null,
        selectedUser:null,
        onlineUsers:[],
        unreadMessages: {},
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser = action.payload;
        },
        setOtherUser:(state,action)=>{
            state.otherUsers = action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload;
        },
        resetUserState:(state,action)=>{
            
            state.otherUsers = null;
            state.selectedUser = null;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        },
        setUnreadMessage: (state, action) => {
            const { fromUserId } = action.payload;
            if (state.unreadMessages[fromUserId]) {
                state.unreadMessages[fromUserId]++;
            } else {
                state.unreadMessages[fromUserId] = 1;
            }
        },
        clearUnreadMessage: (state, action) => {
            const { fromUserId } = action.payload;
            delete state.unreadMessages[fromUserId];
        }
        
    }

    
}
)
export const {setAuthUser,setOtherUser,setSelectedUser,resetUserState,setOnlineUsers,setUnreadMessage,clearUnreadMessage} = userSlice.actions;
export default userSlice.reducer;