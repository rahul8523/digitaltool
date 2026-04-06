import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const DXChat = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <Header />
                <div className="p-4">
                    <h3>DX Team Chat</h3>
                    <p>Collaborate with your team in real-time. Start chatting, sharing updates, and staying connected.</p>
                </div>

            </div>
        </div>
    )
}

export default DXChat