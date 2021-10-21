import { createSlice } from '@reduxjs/toolkit'

// Types
import { PayloadAction } from '@reduxjs/toolkit'
import { ILoadingStatus } from '#interfaces/common'
import { IFinanceCategory, IFinanceCategoryType, IFinanceRecord } from '#interfaces/finance'

// Utils
import { Http } from '#utils/Http'

const initialState: IState = {
	categories: {
		items: [],
		status: 'idle',
	},
	categoryTypes: {
		items: [],
		status: 'idle',
	},
	chartRecords: {
		items: [],
		status: 'idle',
	},
	records: {
		notTrashed: {
			items: [],
			status: 'idle',
		},
		trashed: {
			items: [],
			status: 'idle',
		},
	},
}

const slice = createSlice({
	name: 'finance',
	initialState,
	reducers: {
		addNotTrashedRecordsItems: (state, action: PayloadAction<IFinanceRecord[]>) => {
			state.records.notTrashed.items.push(...action.payload)
		},

		createCategory: (state, action: PayloadAction<IFinanceCategory>) => {
			state.categories.items.unshift(action.payload)
		},

		createRecord: (state, action: PayloadAction<IFinanceRecord>) => {
			state.records.notTrashed.items.unshift(action.payload)
		},

		deleteCategory: (state, action: PayloadAction<IFinanceCategory['id']>) => {
			state.categories.items = state.categories.items.filter(
				(category) => category.id !== action.payload,
			)
		},

		deleteRecord: (
			state,
			action: PayloadAction<{ permanently: boolean; record: IFinanceRecord }>,
		) => {
			state.records.notTrashed.items = state.records.notTrashed.items.filter(
				(record) => record.id !== action.payload.record.id,
			)

			if (action.payload.permanently) return

			state.records.trashed.items.unshift(action.payload.record)
		},

		restoreRecord: (state, action: PayloadAction<IFinanceRecord>) => {
			state.records.trashed.items = state.records.trashed.items.filter(
				(record) => record.id !== action.payload.id,
			)

			state.records.notTrashed.items.unshift(action.payload)
		},

		setCategories: (state, action: PayloadAction<IFinanceCategory[]>) => {
			state.categories = {
				items: action.payload,
				status: 'success',
			}
		},

		setChartRecords: (state, action: PayloadAction<IFinanceRecord[]>) => {
			state.chartRecords = {
				items: action.payload,
				status: 'success',
			}
		},

		setNotTrashedRecordsStatus: (state, action: PayloadAction<ILoadingStatus>) => {
			state.records.notTrashed.status = action.payload
		},

		setTrashedRecords: (state, action: PayloadAction<IFinanceRecord[]>) => {
			state.records.trashed = {
				items: action.payload,
				status: 'success',
			}
		},

		setCategoryTypes: (state, action: PayloadAction<IFinanceCategoryType[]>) => {
			state.categoryTypes = {
				items: action.payload,
				status: 'success',
			}
		},

		updateCategory: (state, action: PayloadAction<IFinanceCategory>) => {
			const categoryIndex = state.categories.items.findIndex(
				(category) => category.id === action.payload.id,
			)

			state.categories.items[categoryIndex] = action.payload
		},

		updateRecord: (state, action: PayloadAction<IFinanceRecord>) => {
			const recordIndex = state.records.notTrashed.items.findIndex(
				(record) => record.id === action.payload.id,
			)

			state.records.notTrashed.items[recordIndex] = action.payload
		},
	},
})

export const {
	addNotTrashedRecordsItems,
	createCategory,
	createRecord,
	deleteCategory,
	deleteRecord,
	restoreRecord,
	setCategories,
	setCategoryTypes,
	setChartRecords,
	setNotTrashedRecordsStatus,
	setTrashedRecords,
	updateCategory,
	updateRecord,
} = slice.actions
export const financeReducer = slice.reducer

// Types
interface IState {
	categories: {
		items: IFinanceCategory[]
		status: ILoadingStatus
	}
	categoryTypes: {
		items: IFinanceCategoryType[]
		status: ILoadingStatus
	}
	chartRecords: {
		items: IFinanceRecord[]
		status: ILoadingStatus
	}
	records: {
		notTrashed: {
			items: IFinanceRecord[]
			status: ILoadingStatus
		}
		trashed: {
			items: IFinanceRecord[]
			status: ILoadingStatus
		}
	}
}