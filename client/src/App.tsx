import { useState } from 'react';
import { MyVacationBank } from './views/MyVacationBank';
import { BookVacationView } from './views/BookVacationView';

export default function App() {
    const [showBooking, setShowBooking] = useState(false);

    if (showBooking) {
        return <BookVacationView onBackToOverview={() => setShowBooking(false)} />;
    }

    return <MyVacationBank onBookVacation={() => setShowBooking(true)} />;
}