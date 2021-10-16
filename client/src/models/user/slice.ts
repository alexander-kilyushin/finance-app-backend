import { createSlice } from '@reduxjs/toolkit'

// Types
import { PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '#models/store'
import { IUser } from '#interfaces/user'

// Utils
import { Http } from '#utils/Http'

const initialState: IState = {
	isUserLoggedin: !!localStorage.authToken,
	userData: {
		id: 0,
		username: 'string',
	},
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setIsUserLoggedIn: (state, action: PayloadAction<IState['isUserLoggedin']>) => {
			state.isUserLoggedin = action.payload
		},
		logOut: (state) => {
			localStorage.authToken = ''
			state.isUserLoggedin = false
			state.userData = initialState.userData
		},
	},
})

export const { logOut, setIsUserLoggedIn } = userSlice.actions
export const userReducer = userSlice.reducer

// Thunks
export const logIn =
	({ password, username }: Pick<IUser, 'password' | 'username'>): AppThunk =>
	async (dispatch) => {
		const { authToken } = await Http.post({
			payload: {
				password,
				username,
			},
			url: 'api/login',
		})

		if (!authToken) return

		localStorage.authToken = authToken

		dispatch(setIsUserLoggedIn(true))
	}

// Types
interface IState {
	isUserLoggedin: boolean
	userData: Pick<IUser, 'id' | 'username'>
}
