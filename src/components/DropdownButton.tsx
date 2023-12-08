import Arrow_No_Tail from "../images/Arrow_No_Tail.svg";

interface DropdownButton {
    active: boolean;
    onClick: () => void;
}

export default function DropdownButton({ active, onClick }: DropdownButton) {
    return <div className={`dropdown-btn btn ${active ? 'selected' : ''}`} onClick={onClick}>
        <img src={Arrow_No_Tail} draggable="false"/>
    </div>
}