import { X } from "lucide-react";
import "./NotificationCard.css";

export default function NotificationCard({ type, title, subtitle, target, onView, onClose, emailContent }) {
    const isBrowser = type === "browser";
    const isEmail = type === "email";

    return (
        <div className={`notification-card ${type}`}>
            <div className="notification-header">
                <div className="header-content">
                    <div className={`notification-icon-wrapper ${type}`}>
                        {isBrowser ? (
                            <div className="blue-dot" />
                        ) : isEmail ? (
                            <div className="email-icon">
                                <span className="app-icon-small">🔷</span>
                            </div>
                        ) : (
                            <div className="yellow-circle">
                                <span className="coin-symbol">₿</span>
                            </div>
                        )}
                    </div>
                    <span className="notification-title">{title}</span>
                </div>
                {(isBrowser || isEmail) && (
                    <div className="header-right">
                        {isEmail && <span className="sender-tag">Ise nom</span>}
                        <button className="notification-close" onClick={onClose}>
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            <div className="notification-body">
                {isEmail && <div className="email-app-badge"><span className="app-icon">🔷</span> CryptoTracker</div>}
                <p className={`notification-subtitle ${isEmail ? 'email-title' : ''}`}>{subtitle}</p>

                {isEmail && emailContent ? (
                    <div className="email-details">
                        <p className="email-greeting">Hello Mebe,</p>
                        <p className="email-desc">Your alert for Bitcoin has been triggered.</p>
                        <ul className="email-stats">
                            <li>Current Price: <span>{emailContent.currentPrice}</span></li>
                            <li>Target Price: <span>{emailContent.targetPrice}</span></li>
                            <li>Condition: <span>{emailContent.condition}</span></li>
                        </ul>
                        <p className="email-footer-text">Visit your dashboard to take action.</p>
                    </div>
                ) : (
                    target && <p className="notification-target">Your target was: <span>{target}</span></p>
                )}
            </div>

            {!isBrowser && !isEmail && (
                <button className="view-alert-btn" onClick={onView}>
                    View Alert
                </button>
            )}
            {isEmail && (
                <button className="view-alert-btn email-btn" onClick={onView}>
                    View Alert
                </button>
            )}
        </div>
    );
}
