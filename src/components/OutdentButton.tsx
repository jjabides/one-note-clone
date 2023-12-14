import Outdent from "../images/Outdent.svg";

interface OutdentButtonProps {
    onClick: () => void;
}

export default function OutdentButton({ onClick }: OutdentButtonProps) {

    return <div className="outdent-button btn size-32-32 border-radius-4 flex-center" onClick={onClick}>
        <img src={Outdent} className="size-16-16" draggable="false"/>
    </div>
}