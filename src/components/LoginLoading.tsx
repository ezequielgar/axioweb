import React from 'react';
import './LoginLoading.css';

const LoginLoading = () => {
    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center">
            {/* Animation provided by user */}
            <div className="rings anim-pan">
                <div style={{ "--delay": "06" } as React.CSSProperties} className="ring anim-zoomIn"></div>
                <div style={{ "--delay": "04" } as React.CSSProperties} className="ring anim-zoomIn"></div>
                <div style={{ "--delay": "03" } as React.CSSProperties} className="ring anim-zoomIn"></div>
                <div style={{ "--delay": "02" } as React.CSSProperties} className="ring anim-zoomIn"></div>
                <div style={{ "--delay": "01" } as React.CSSProperties} className="ring anim-zoomIn"></div>
                <div style={{ "--delay": "00" } as React.CSSProperties} className="ring anim-zoomIn"></div>
            </div>

            {/* Custom text */}
            <h2 className="text-2xl font-semibold text-white mt-8 tracking-wide animate-pulse text-center px-4" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                Ingresando a servidores de Axio
            </h2>
        </div>
    );
};

export default LoginLoading;
