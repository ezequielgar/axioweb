interface LogoutButtonProps {
    onClick: () => void;
}

export default function LogoutButton({ onClick }: LogoutButtonProps) {
    return (
        <>
            <style>{`
                .logout-button {
                    width: 140px;
                    height: 40px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    background: #e62222;
                    border: none;
                    border-radius: 8px;
                    box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
                    transition: 200ms;
                }

                .logout-button:hover {
                    background: #ff3636;
                }

                .logout-button:focus {
                    outline: none;
                }

                .logout-button .logout-text {
                    transform: translateX(10px);
                    color: white;
                    font-weight: 600;
                    font-size: 14px;
                    transition: 200ms;
                }

                .logout-button:hover .logout-text {
                    color: transparent;
                }

                .logout-button .logout-icon {
                    position: absolute;
                    border-left: 1px solid #c41b1b;
                    transform: translateX(105px);
                    height: 32px;
                    width: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: 200ms;
                }

                .logout-button:hover .logout-icon {
                    width: 140px;
                    border-left: none;
                    transform: translateX(0);
                }

                .logout-button .logout-icon svg {
                    width: 14px;
                    fill: #eee;
                    transition: 200ms;
                }

                .logout-button:active .logout-icon svg {
                    transform: scale(0.8);
                }
            `}</style>
            <button
                className="logout-button noselect"
                onClick={onClick}
            >
                <span className="logout-text">Cerrar Sesión</span>
                <span className="logout-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                    </svg>
                </span>
            </button>
        </>
    );
}
