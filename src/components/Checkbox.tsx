import { useId } from 'react';
import './Checkbox.css';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    id?: string;
}

export default function Checkbox({ checked, onChange, id }: CheckboxProps) {
    const generatedId = useId();
    const checkboxId = id || `neon-checkbox-${generatedId}`;

    return (
        <label className="neon-checkbox">
            <input
                type="checkbox"
                id={checkboxId}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div className="neon-checkbox__frame">
                <div className="neon-checkbox__box">
                    <div className="neon-checkbox__check-container">
                        <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                            <path d="M3,12.5l7,7L21,5"></path>
                        </svg>
                    </div>
                    <div className="neon-checkbox__glow"></div>
                    <div className="neon-checkbox__borders">
                        <span></span><span></span><span></span><span></span>
                    </div>
                </div>
                <div className="neon-checkbox__effects">
                    <div className="neon-checkbox__particles">
                        <span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span>
                    </div>
                    <div className="neon-checkbox__rings">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                    </div>
                    <div className="neon-checkbox__sparks">
                        <span></span><span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        </label>
    );
}
