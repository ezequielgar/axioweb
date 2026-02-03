interface RequestButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    text?: string;
    type?: 'button' | 'submit';
    variant?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
    size?: 'small' | 'medium';
    icon?: React.ReactNode;
    width?: string;
}

export default function RequestButton({
    onClick,
    disabled = false,
    text = "Solicitar Oblea",
    type = 'button',
    variant = 'blue',
    size = 'medium',
    icon,
    width = '100%'
}: RequestButtonProps) {
    // Configuración de colores por variante
    const variantColors = {
        blue: {
            border: '#60a5fa', // blue-400
            bg: '#1e293b', // slate-800
            fill: '#3b82f6' // blue-500
        },
        green: {
            border: '#4ade80', // green-400
            bg: '#1e293b', // slate-800
            fill: '#22c55e' // green-500
        },
        purple: {
            border: '#c084fc', // purple-400
            bg: '#1e293b', // slate-800
            fill: '#a855f7' // purple-500
        },
        red: {
            border: '#f87171', // red-400
            bg: '#1e293b', // slate-800
            fill: '#ef4444' // red-500
        },
        yellow: {
            border: '#facc15', // yellow-400
            bg: '#1e293b', // slate-800
            fill: '#eab308' // yellow-500
        }
    };

    // Configuración de tamaños
    const sizeConfig = {
        small: {
            outerPadding: '6px',
            innerPadding: '8px 12px',
            fontSize: '12px'
        },
        medium: {
            outerPadding: '8px',
            innerPadding: '14px 20px',
            fontSize: '14px'
        }
    };

    const colors = variantColors[variant];
    const sizing = sizeConfig[size];

    return (
        <>
            <style>{`
                .request-button-${variant} {
                    -moz-appearance: none;
                    -webkit-appearance: none;
                    appearance: none;
                    border: none;
                    background: none;
                    cursor: pointer;
                    position: relative;
                    padding: ${sizing.outerPadding};
                    text-transform: uppercase;
                    font-weight: bold;
                    font-size: ${sizing.fontSize};
                    transition: all .15s ease;
                }

                .request-button-${variant}:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .request-button-${variant}::before,
                .request-button-${variant}::after {
                    content: '';
                    display: block;
                    position: absolute;
                    right: 0;
                    left: 0;
                    height: calc(50% - 5px);
                    border: 1px solid ${colors.border};
                    transition: all .15s ease;
                }

                .request-button-${variant}::before {
                    top: 0;
                    border-bottom-width: 0;
                }

                .request-button-${variant}::after {
                    bottom: 0;
                    border-top-width: 0;
                }

                .request-button-${variant}:active,
                .request-button-${variant}:focus {
                    outline: none;
                }

                .request-button-${variant}:active::before,
                .request-button-${variant}:active::after {
                    right: 3px;
                    left: 3px;
                }

                .request-button-${variant}:active::before {
                    top: 3px;
                }

                .request-button-${variant}:active::after {
                    bottom: 3px;
                }

                .request-button-${variant}_lg {
                    position: relative;
                    display: block;
                    padding: ${sizing.innerPadding};
                    color: #fff;
                    background-color: ${colors.bg};
                    overflow: hidden;
                    box-shadow: inset 0px 0px 0px 1px transparent;
                    text-align: center;
                }

                .request-button-${variant}_lg::before {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 2px;
                    height: 2px;
                    background-color: ${colors.bg};
                }

                .request-button-${variant}_lg::after {
                    content: '';
                    display: block;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 4px;
                    height: 4px;
                    background-color: ${colors.bg};
                    transition: all .2s ease;
                }

                .request-button-${variant}_sl {
                    display: block;
                    position: absolute;
                    top: 0;
                    bottom: -1px;
                    left: -8px;
                    width: 0;
                    background-color: ${colors.fill};
                    transform: skew(-15deg);
                    transition: all .2s ease;
                }

                .request-button-${variant}_text {
                    position: relative;
                }

                .request-button-${variant}:hover .request-button-${variant}_sl {
                    width: calc(100% + 15px);
                }

                .request-button-${variant}:hover .request-button-${variant}_lg::after {
                    background-color: #fff;
                }

                .request-button-${variant}:disabled:hover .request-button-${variant}_sl {
                    width: 0;
                }

                .request-button-${variant}:disabled:hover .request-button-${variant}_lg::after {
                    background-color: ${colors.bg};
                }
            `}</style>
            <button
                className={`request-button-${variant}`}
                onClick={onClick}
                disabled={disabled}
                type={type}
                style={{ width, minWidth: size === 'small' ? '150px' : '200px' }}
            >
                <span className={`request-button-${variant}_lg`}>
                    <span className={`request-button-${variant}_sl`}></span>
                    <span className={`request-button-${variant}_text`}>
                        {icon || text}
                    </span>
                </span>
            </button>
        </>
    );
}
