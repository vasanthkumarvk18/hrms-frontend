export interface Attendance {
    id?: number;
    employee?: any;
    date?: string;
    checkIn?: string;  // LocalTime from backend
    checkOut?: string; // LocalTime from backend
    sessionNo?: number;
    status?: string; // PRESENT, ABSENT, HALF_DAY
}

export interface DailySummary {
    totalMinutes: number;
    totalHours: number;
    status: string;
}

export interface MonthlySummary {
    [key: string]: any;
}
