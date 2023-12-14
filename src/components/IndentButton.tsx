import Indent from "../images/Indent.svg";

interface IndentButtonProps {
    onClick: () => void;
}

export default function IndentButton({ onClick }: IndentButtonProps) {

    return <div className="indent-button btn size-32-32 flex-center border-radius-4" onClick={onClick}>
        <img src={Indent} className="size-16-16" draggable="false"/>
    </div>
}