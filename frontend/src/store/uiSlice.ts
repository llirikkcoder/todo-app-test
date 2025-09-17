import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  // Modal states
  loginModalOpen: boolean;

  // Form states
  createTaskForm: {
    username: string;
    email: string;
    text: string;
    errors: Record<string, string>;
    success: boolean;
    isSubmitting: boolean;
  };

  loginForm: {
    username: string;
    password: string;
    errors: Record<string, string>;
  };

  // Task editing states (keyed by task ID)
  editingTasks: Record<number, {
    isEditing: boolean;
    editedText: string;
  }>;

  // Sort states
  sortBy: 'username' | 'email' | 'status' | null;
  sortOrder: 'asc' | 'desc';
}

const initialState: UIState = {
  loginModalOpen: false,
  createTaskForm: {
    username: '',
    email: '',
    text: '',
    errors: {},
    success: false,
    isSubmitting: false,
  },
  loginForm: {
    username: '',
    password: '',
    errors: {},
  },
  editingTasks: {},
  sortBy: null,
  sortOrder: 'asc',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.loginModalOpen = action.payload;
      if (!action.payload) {
        // Reset login form when closing modal
        state.loginForm = initialState.loginForm;
      }
    },

    // Create task form actions
    setCreateTaskFormField: (state, action: PayloadAction<{ field: 'username' | 'email' | 'text'; value: string }>) => {
      state.createTaskForm[action.payload.field] = action.payload.value;
    },
    setCreateTaskFormErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.createTaskForm.errors = action.payload;
    },
    setCreateTaskFormSuccess: (state, action: PayloadAction<boolean>) => {
      state.createTaskForm.success = action.payload;
    },
    setCreateTaskFormSubmitting: (state, action: PayloadAction<boolean>) => {
      state.createTaskForm.isSubmitting = action.payload;
    },
    resetCreateTaskForm: (state) => {
      state.createTaskForm = initialState.createTaskForm;
    },

    // Login form actions
    setLoginFormField: (state, action: PayloadAction<{ field: 'username' | 'password'; value: string }>) => {
      state.loginForm[action.payload.field] = action.payload.value;
    },
    setLoginFormErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.loginForm.errors = action.payload;
    },

    // Task editing actions
    setTaskEditing: (state, action: PayloadAction<{ taskId: number; isEditing: boolean; text?: string }>) => {
      const { taskId, isEditing, text } = action.payload;
      if (isEditing) {
        state.editingTasks[taskId] = {
          isEditing: true,
          editedText: text || '',
        };
      } else {
        delete state.editingTasks[taskId];
      }
    },
    setTaskEditedText: (state, action: PayloadAction<{ taskId: number; text: string }>) => {
      const { taskId, text } = action.payload;
      if (state.editingTasks[taskId]) {
        state.editingTasks[taskId].editedText = text;
      }
    },

    // Sort actions
    setSortBy: (state, action: PayloadAction<'username' | 'email' | 'status' | null>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
  },
});

export const {
  setLoginModalOpen,
  setCreateTaskFormField,
  setCreateTaskFormErrors,
  setCreateTaskFormSuccess,
  setCreateTaskFormSubmitting,
  resetCreateTaskForm,
  setLoginFormField,
  setLoginFormErrors,
  setTaskEditing,
  setTaskEditedText,
  setSortBy,
  setSortOrder,
} = uiSlice.actions;

export default uiSlice.reducer;