// src/components/Sidebar.jsx
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../assets/new-dx-logo-updated.png'
import 'bootstrap-icons/font/bootstrap-icons.css'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div
      className={`sidebar text-white vh-100 p-3  d-flex flex-column ${collapsed ? 'collapsed-sidebar' : ''}`}
      style={{ width: collapsed ? '80px' : '250px', position: 'sticky', top: 0, transition: 'width 0.3s' }}
    >
      <div className="d-flex align-items-center justify-content-between mb-4">
        {!collapsed && <img src={Logo} alt="Logo" className="sidebarLogo" style={{ maxWidth: '120px' }} />}
        <button onClick={toggleSidebar} className="btn btn-sm text-white">
          <i className="bi bi-list fs-4"></i>
        </button>
      </div>

      <ul className="nav flex-column sidebarLinks">
        <li className="nav-item mb-4">
          <NavLink
            to="/dashboard/home"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 ${isActive ? 'active-link' : 'text-white'}`
            }
          >
            <i className="bi bi-house-door-fill"></i>
            {!collapsed && 'Home'}
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink
            to="/dashboard/task"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 ${isActive ? 'active-link' : 'text-white'}`
            }
          >
            <i className="bi bi-list-check"></i>
            {!collapsed && 'My Tasks'}
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink
            to="/dashboard/efficiency"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 ${isActive ? 'active-link' : 'text-white'}`
            }
          >
            <i className="bi bi-speedometer"></i>
            {!collapsed && 'Efficiency'}
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink
            to="/dashboard/attendance"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 ${isActive ? 'active-link' : 'text-white'}`
            }
          >
            <i className="bi bi-calendar-check-fill"></i>
            {!collapsed && 'Attendance'}
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink
            to="/dashboard/leave-management"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 ${isActive ? 'active-link' : 'text-white'}`
            }
          >
            <i className="bi bi-clipboard-check-fill"></i>
            {!collapsed && 'Leave Management'}
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink
            to="/dashboard/office-events"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 ${isActive ? 'active-link' : 'text-white'}`
            }
          >
            <i className="bi bi-calendar-event-fill"></i>
            {!collapsed && 'Office Events'}
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink
            to="/dashboard/team-chat"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 ${isActive ? 'active-link' : 'text-white'}`
            }
          >
            <i className="bi bi-chat-dots-fill"></i>
            {!collapsed && 'Team Chat'}
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
