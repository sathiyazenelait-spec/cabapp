import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'pending' | 'boarded' | 'absent';
  phone: string;
}

export interface StudentState {
  students: Student[];
  tripStarted: boolean;
  activeStopIndex: number;
}

const initialState: StudentState = {
  students: [
    { id: 's1', name: 'Mahesh Kumar', grade: 'Class V-C', status: 'pending', phone: '+91 98401 23456' },
    { id: 's2', name: 'Ananya Tiwari', grade: 'Class IV', status: 'boarded', phone: '+91 98401 23457' },
    { id: 's3', name: 'Swapnil Vashistha', grade: 'Class VII-A', status: 'absent', phone: '+91 98401 23458' },
    { id: 's4', name: 'Ayan Mukharjee', grade: 'Class III', status: 'pending', phone: '+91 98401 23459' },
    { id: 's5', name: 'Reyan Singhaniya', grade: 'Class II', status: 'pending', phone: '+91 98401 23460' },
    { id: 's6', name: 'Sampan Roy', grade: 'Class IX-B', status: 'boarded', phone: '+91 98401 23461' },
  ],
  tripStarted: false,
  activeStopIndex: 1
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    toggleStudentStatus: (state, action: PayloadAction<string>) => {
      const student = state.students.find(s => s.id === action.payload);
      if (student) {
        if (student.status === 'pending') {
          student.status = 'boarded';
        } else if (student.status === 'boarded') {
          student.status = 'absent';
        } else {
          student.status = 'pending';
        }
      }
    },
    markAllBoarded: (state) => {
      state.students.forEach(s => {
        s.status = 'boarded';
      });
    },
    setTripStarted: (state, action: PayloadAction<boolean>) => {
      state.tripStarted = action.payload;
    },
    incrementStop: (state) => {
      state.activeStopIndex = Math.min(4, state.activeStopIndex + 1);
    },
    resetStop: (state) => {
      state.activeStopIndex = 1;
      state.students.forEach(s => {
        s.status = 'pending';
      });
    }
  }
});

export const {
  toggleStudentStatus,
  markAllBoarded,
  setTripStarted,
  incrementStop,
  resetStop
} = studentSlice.actions;

export default studentSlice.reducer;
