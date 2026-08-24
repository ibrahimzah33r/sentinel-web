import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div>
        <h1>Sentinel</h1>
        <p>Analyst Console</p>
      </div>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/cases">Cases</NavLink>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar