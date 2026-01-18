import React from 'react';
import './AdminPanelButton.css';

interface AdminPanelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    // Add specific props if needed
}

const AdminPanelButton: React.FC<AdminPanelButtonProps> = ({ onClick, className, ...props }) => {
    return (
        <button
            className={`admin-panel-btn ${className || ''}`}
            onClick={onClick}
            {...props}
        >
            Admin Panel
        </button>
    );
};

export default AdminPanelButton;
