interface AnimatedButtonProps {
    onClick: () => void;
    className?: string;
}

export default function AnimatedButton({ onClick, className = '' }: AnimatedButtonProps) {
    const letters = ['A', 'X', 'I', 'O'];

    return (
        <>
            <style>{`
                .animated-button {
                    display: flex;
                }

                .letter-box {
                    width: 28px;
                    height: 32px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 13px;
                    font-weight: 700;
                    color: #fff;
                    transition: all .8s;
                    cursor: pointer;
                    position: relative;
                    background: rgb(59, 130, 246); /* blue-500 */
                    overflow: hidden;
                }

                .letter-box:before {
                    position: absolute;
                    top: 0;
                    background: #1e293b; /* slate-800 */
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: translateY(100%);
                    transition: transform .4s;
                    font-weight: 700;
                }

                .letter-box:nth-child(1)::before {
                    content: 'E';
                    transform: translateY(100%);
                }

                .letter-box:nth-child(2)::before {
                    content: 'D';
                    transform: translateY(-100%);
                }

                .letter-box:nth-child(3)::before {
                    content: 'I';
                    transform: translateY(100%);
                }

                .letter-box:nth-child(4)::before {
                    content: 'T';
                    transform: translateY(-100%);
                }

                .animated-button:hover .letter-box:before {
                    transform: translateY(0);
                }
            `}</style>
            <div
                className={`animated-button ${className}`}
                onClick={onClick}
            >
                {letters.map((letter, index) => (
                    <div key={index} className="letter-box">
                        {letter}
                    </div>
                ))}
            </div>
        </>
    );
}
