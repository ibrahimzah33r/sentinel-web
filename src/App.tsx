import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import CasesPage from './pages/CasesPage'
import DashboardPage from './pages/DashboardPage'
import EventsPage from './pages/EventsPage'

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/cases" element={<CasesPage />} />
      </Routes>
    </AppLayout>
  )
}

export default App