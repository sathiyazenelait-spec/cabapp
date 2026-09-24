import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Driver {
  id: string;
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  seatsTotal: number;
  seatsAvailable: number;
  priceMonthly: number;
  trustScore: number;
  onTimeRate: number;
}

export interface TripState {
  drivers: Driver[];
  selectedDriverId: string | null;
  subscriptionPlan: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  alertDistance: number; // radius threshold in miles (Template 2)
  sosTriggered: boolean;
  searchParams: {
    school: string;
    pickup: string;
  };
}

const initialState: TripState = {
  drivers: [
    {
      id: 'd1',
      name: 'Kumar Swamy',
      vehicle: 'Mercedes Van (White)',
      plate: '34 ABC 123',
      rating: 4.8,
      seatsTotal: 12,
      seatsAvailable: 3,
      priceMonthly: 2500,
      trustScore: 96,
      onTimeRate: 98,
    },
    {
      id: 'd2',
      name: 'Ravi Chandran',
      vehicle: 'Suzuki Cab (Silver)',
      plate: '06 MH 456',
      rating: 4.7,
      seatsTotal: 6,
      seatsAvailable: 2,
      priceMonthly: 2800,
      trustScore: 94,
      onTimeRate: 95,
    },
    {
      id: 'd3',
      name: 'Suresh Kumar',
      vehicle: 'Force Traveller (Yellow)',
      plate: '14 TN 789',
      rating: 4.6,
      seatsTotal: 15,
      seatsAvailable: 5,
      priceMonthly: 2300,
      trustScore: 92,
      onTimeRate: 94,
    }
  ],
  selectedDriverId: 'd1',
  subscriptionPlan: 'monthly',
  alertDistance: 0.5,
  sosTriggered: false,
  searchParams: {
    school: 'ABC Matriculation School',
    pickup: 'Mehta Nagar, Chennai'
  }
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    selectDriver: (state, action: PayloadAction<string>) => {
      state.selectedDriverId = action.payload;
    },
    updateSubscriptionPlan: (state, action: PayloadAction<'weekly' | 'monthly' | 'quarterly' | 'annual'>) => {
      state.subscriptionPlan = action.payload;
    },
    updateAlertDistance: (state, action: PayloadAction<number>) => {
      state.alertDistance = action.payload;
    },
    toggleSOS: (state) => {
      state.sosTriggered = !state.sosTriggered;
    },
    updateSearchParams: (state, action: PayloadAction<{ school: string; pickup: string }>) => {
      state.searchParams = action.payload;
    }
  }
});

export const {
  selectDriver,
  updateSubscriptionPlan,
  updateAlertDistance,
  toggleSOS,
  updateSearchParams
} = tripSlice.actions;

export default tripSlice.reducer;
