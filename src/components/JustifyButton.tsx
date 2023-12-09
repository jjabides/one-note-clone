import JustifyLeft from "../images/JustifyLeft.svg";
import JustifyCenter from "../images/JustifyCenter.svg";
import JustifyRight from "../images/JustifyRight.svg";
import ButtonDropdown from "./ButtonDropdown";
import { useState } from "react";

interface JustifyButtonProps {
    applyStyle: (style: string) => void;
}

export default function JustifyButton({ applyStyle }: JustifyButtonProps) {
    const [justify, setJustify] = useState<string>('JustifyLeft');

    function selectStyle(e: React.MouseEvent, style: string) {
        setJustify(style)
        applyStyle(style)
        e.target.dispatchEvent(new Event('close-dropdown', { bubbles: true }))
    }

    return <ButtonDropdown
        onClick={() => { }}
        buttonContent={
            <img src={JustifyLeft} className="size-16-16" />
        }
        menu={
            <div className="justify-button-menu dropdown-window pad-8">
                <ul>
                    <li className="flex-center-vertical gap-12 pad-8 btn" onClick={e => selectStyle(e, 'JustifyLeft')}>
                        <img src={JustifyLeft} className="size-16-16"></img>
                        <span>Align Left</span>
                    </li>
                    <li className="flex-center-vertical gap-12 pad-8 btn" onClick={e => selectStyle(e, 'JustifyCenter')}>
                        <img src={JustifyCenter} className="size-16-16"></img>
                        <span>Align Center</span>
                    </li>
                    <li className="flex-center-vertical gap-12 pad-8 btn" onClick={e => selectStyle(e, 'JustifyRight')}>
                        <img src={JustifyRight} className="size-16-16"></img>
                        <span>Align Right</span>
                    </li>
                </ul>
            </div>
        }></ButtonDropdown>
}