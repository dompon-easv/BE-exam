export interface CalendarCell {
    date: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
}

export function generateCalendarGrid(year: number, monthIndex: number): CalendarCell[] {
    const cells: CalendarCell[] = [];

    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 = Sun, 1 = Mon ...
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

    // 1. Padding days from the previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        cells.push({
            date: new Date(year, monthIndex - 1, day),
            dayNumber: day,
            isCurrentMonth: false,
        });
    }

    // 2. Days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push({
            date: new Date(year, monthIndex, day),
            dayNumber: day,
            isCurrentMonth: true,
        });
    }

    // 3. Trailing padding days from the next month (fills out the 35 or 42 grid slots)
    const remainingSlots = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length;
    for (let day = 1; day <= remainingSlots; day++) {
        cells.push({
            date: new Date(year, monthIndex + 1, day),
            dayNumber: day,
            isCurrentMonth: false,
        });
    }

    return cells;
}