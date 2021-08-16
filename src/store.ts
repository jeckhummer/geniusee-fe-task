import {
    createSlice,
    configureStore,
    createAsyncThunk,
    SerializedError,
    PayloadAction,
    AsyncThunk,
    ActionReducerMapBuilder
} from '@reduxjs/toolkit';

import { IStatesReportByDate, ITimeSpanReport } from './models';

interface AsyncData<T> {
    data: T,
    status: 'idle' | 'loading' | 'success' | 'error',
    error?: SerializedError | null,
}

export const getTimeSpanReport = createAsyncThunk(
    'timeSpanReport',
    // return of promise from args is intentional
    (promise: Promise<ITimeSpanReport>) => promise,
);

export const getStatesReportByDate = createAsyncThunk(
    'statesReportByDate',
    // return of promise from args is intentional
    (promise: Promise<IStatesReportByDate>) => promise,
);

function getExtraReducersCb<T>(thunk: AsyncThunk<T, Promise<T>, {}>) {
    return (builder: ActionReducerMapBuilder<AsyncData<T>>) => builder
        .addCase(thunk.pending, state => {
            state.status = 'loading';
        })
        .addCase(thunk.fulfilled, (state, { payload }: PayloadAction<T>) => {
            state.status = 'success';
            (state as AsyncData<T>).data = payload;
        })
        .addCase(thunk.rejected, (state, { error }) => {
            state.status = 'error';
            state.error = error;
        });
}

const timeSpanReportSlice = createSlice({
    name: 'timeSpanReport',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
    } as AsyncData<ITimeSpanReport>,
    reducers: {},
    extraReducers: getExtraReducersCb(getTimeSpanReport)
})

const statesReportByDateSlice = createSlice({
    name: 'statesReportByDate',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
    } as AsyncData<IStatesReportByDate>,
    reducers: {},
    extraReducers: getExtraReducersCb(getStatesReportByDate)
})

export const store = configureStore({
    reducer: {
        timeSpanReport: timeSpanReportSlice.reducer,
        statesReportByDate: statesReportByDateSlice.reducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch