import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { TasksState, CreateTaskData, UpdateTaskData } from '../types';
import { RootState } from './store';

const initialState: TasksState = {
  tasks: [],
  totalPages: 0,
  currentPage: 1,
  totalTasks: 0,
  sortBy: null,
  sortOrder: 'asc',
  loading: false,
  error: null
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetch',
  async (params: { page: number; sortBy?: string; sortOrder?: string }) => {
    const response = await axios.get('/api/tasks', { params });
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: CreateTaskData) => {
    const response = await axios.post('/api/tasks', taskData);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: number; data: UpdateTaskData }, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const response = await axios.put(`/api/tasks/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalTasks = action.payload.totalTasks;
      })
      .addCase(fetchTasks.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state) => {
        state.currentPage = 1;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload.task;
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      });
  }
});

export const { setSortBy, setSortOrder, setCurrentPage } = tasksSlice.actions;
export default tasksSlice.reducer;