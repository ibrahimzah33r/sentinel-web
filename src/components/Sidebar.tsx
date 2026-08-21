function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h1>Sentinel</h1>
        <p>Analyst Console</p>
      </div>

      <nav>
        <button type="button">Dashboard</button>
        <button type="button">Events</button>
        <button type="button">Cases</button>
      </nav>
    </aside>
  )
}

export default Sidebar