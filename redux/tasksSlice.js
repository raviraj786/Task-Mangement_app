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
  async (_, { rejectedWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectedWithValue(error.response.data.error || error.message);
    }
  }
);

export const fetchtask = createAsyncThunk(
  "task/fetchTask",
  async (id, { rejectedWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("ssssssss", token);
      const response = await axios.get(
        `http://192.168.1.8:5000/api/v1/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response?.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectedWithValue(error.response.data.error || error.message);
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
    console.log("ssssssssss", id, taskData);
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
      return rejectedWithValue(error.response.data.error || error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
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
        state.tasks = action.payload;
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
        state.task.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        console.log(state.task);
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
