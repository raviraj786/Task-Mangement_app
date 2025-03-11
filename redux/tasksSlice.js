import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import axios, { Axios } from "axios";
import { flushSync } from "react-dom";
const BASE_URL = "https://task-mangemant-backend-server.onrender.com/api/v1";

export const fetchtasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found. Please log in again.");
        return rejectWithValue(
          "Authentication Error: No token found. Please log in again."
        );
      }

      // console.log("Stored Token:", token);

      const response = await axios.get(`${BASE_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        // console.log("Fetched Tasks Successfully:", response?.data);
        return response.data;
      } else {
        // console.error("Failed to fetch tasks. Status Code:", response?.status);
        return rejectWithValue("Failed to fetch tasks. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.error("Axios Error:", error?.response?.data || error.message);

        if (error.response?.status === 401) {
          return rejectWithValue("Unauthorized. Please log in again.");
        }

        if (error.response?.status === 404) {
          return rejectWithValue("Tasks not found.");
        }

        return rejectWithValue();
        // error.response?.data?.error || "Failed to fetch tasks. Network or server error."
      } else {
        console.error("Unexpected Error:", error);
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const fetchtask = createAsyncThunk(
  "task/fetchTask",
  async (id, { rejectedWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      // console.log("ID: ", id);
      const response = await axios.get(
        `https://task-mangemant-backend-server.onrender.com/api/v1/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Response Data: ", response?.data);
      return response.data;
    } catch (error) {
      // console.log("Error: ", error);
      if (error.response) {
        return rejectedWithValue(error.response.data.error || error.message);
      }
      return rejectedWithValue(error.message);
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, { rejectedWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/tasks`, taskData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectedWithValue(error.response.data.error || error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("update", token);
      const response = await axios.put(
        `https://task-mangemant-backend-server.onrender.com/api/v1/tasks/${id}`,
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("update data", response.data);
      return response.data;
    } catch (error) {
      console.log("rrros", error);
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectedWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${BASE_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token} ` },
      });
      return id;
    } catch (error) {
      console.log(error);
      return rejectedWithValue(error.response.data.error || error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: { data: { Tasks: [] } },
    task: null,
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchtasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchtasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // Storing the entire response
      })
      .addCase(fetchtasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchtask.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })

      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.data.Tasks.push(action.payload.data);
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.data.Tasks.findIndex(
          (task) => task.id === action.payload.data.id
        );
        if (index !== -1) {
          state.tasks.data.Tasks[index] = action.payload.data;
        }
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks.data.Tasks = state.tasks.data.Tasks.filter(
          (task) => task.id !== action.payload
        );
      });
  },
});

export default tasksSlice.reducer;
