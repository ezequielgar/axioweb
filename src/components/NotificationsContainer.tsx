import NotificationToast from './NotificationToast';
import type { SolicitudReimpresion } from '../types/reimpresiones';

interface NotificationsContainerProps {
    notifications: SolicitudReimpresion[];
    onDismiss: (id: string) => void;
    onNavigate: () => void;
}

export default function NotificationsContainer({ notifications, onDismiss, onNavigate }: NotificationsContainerProps) {
    if (notifications.length === 0) return null;

    // Limitar a 3 notificaciones visibles simultáneamente
    const visibleNotifications = notifications.slice(0, 3);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
            <div className="pointer-events-auto space-y-3">
                {visibleNotifications.map((notification) => (
                    <NotificationToast
                        key={notification.id}
                        solicitud={notification}
                        onDismiss={() => onDismiss(notification.id)}
                        onNavigate={onNavigate}
                    />
                ))}
            </div>

            {/* Indicador de más notificaciones */}
            {notifications.length > 3 && (
                <div className="pointer-events-auto">
                    <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-600/50 rounded-lg shadow-xl px-4 py-2 text-center">
                        <span className="text-slate-300 text-sm">
                            +{notifications.length - 3} más {notifications.length - 3 === 1 ? 'notificación' : 'notificaciones'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
