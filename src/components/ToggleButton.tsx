import "../styles/toggle-button.css";

interface ToggleButton {
    icon: string;
    active: boolean;
    onClick: () => void;
    iconSize?: number;
}

export default function ToggleButton({ icon, active, onClick, iconSize }: ToggleButton) {
    return <div 
    className={`toggle-btn border-radius-4 btn ${active ? 'selected' : ''}`}
    onClick={onClick}>
        <img src={icon} style={{ width: iconSize ? `${iconSize}px` : '16px' }}/>
    </div>
}