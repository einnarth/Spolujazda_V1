'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface CalendarViewProps {
    selectedDate: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
}

export default function CalendarView({ selectedDate, onDateChange }: CalendarViewProps) {
    return (
        <div className="flex justify-center p-2">
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
            />
        </div>
    );
}