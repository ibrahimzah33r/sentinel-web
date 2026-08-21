import { NavLink } from 'react-router-dom'

function Sidebar() {
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
      </nav>
    </aside>
  )
}

export default Sidebar