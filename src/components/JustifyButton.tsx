import JustifyLeft from "../images/JustifyLeft.svg";
import JustifyCenter from "../images/JustifyCenter.svg";
import JustifyRight from "../images/JustifyRight.svg";
import Arrow_No_Tail from "../images/Arrow_No_Tail.svg";
import { useEffect, useRef, useState } from "react";
import Tooltip from "./Tooltip";
import { Props } from "tippy.js";
import { ribbonTippyProps } from "../utilities/tippyProps";

interface JustifyButtonProps {
    applyStyle: (style: string) => void;
    justify: string;
}

export default function JustifyButton({ applyStyle, justify }: JustifyButtonProps) {
    const [open, setOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLElement>();
    const tippyProps = useRef<Props>(ribbonTippyProps)

    useEffect(() => {
        window.addEventListener('click', onWindowClick)
    }, []);

    useEffect(() => {
        return () => {
            window.removeEventListener('click', onWindowClick);
        }
    }, []);

    function onWindowClick(e: MouseEvent) {
        let currentEL: HTMLElement = e.target as HTMLElement;

        // Hide dropdown if click is outside of dropdown element
        while (currentEL) {
            if (currentEL === dropdownRef.current) {
                return;
            }
            currentEL = currentEL.parentElement as HTMLElement;
        }
        setOpen(false);
    }

    function selectStyle(e: React.MouseEvent, style: string) {
        applyStyle(style)
        e.target.dispatchEvent(new Event('close-dropdown', { bubbles: true }))
        setOpen(false);
    }

    return <div className="justify-button position-relative" ref={dropdownRef as any}>
        <Tooltip props={{ ...tippyProps.current, content: 'Paragraph Alignment' }}>
            <div className="btn grid-auto-auto border-radius-4" onClick={() => setOpen(!open)}>
                <div className="icon-wrapper flex-center size-28-32">
                    <img src={JustifyLeft} draggable="false" className="size-16-16" />
                </div>
                <div className="dropdown-arrow-wrapper flex-center size-18-32">
                    <img src={Arrow_No_Tail} className="size-10-10" draggable="false" style={{ rotate: '180deg' }} />
                </div>
            </div>
        </Tooltip>
        {
            open &&
            <div className="justify-button-menu dropdown-window pad-8">
                <ul>
                    <li className={`flex-center-vertical gap-12 pad-8 btn ${justify === 'JustifyLeft' ? 'selected' : ''}`} onClick={e => selectStyle(e, 'JustifyLeft')}>
                        <img src={JustifyLeft} className="size-16-16"></img>
                        <span>Align Left</span>
                    </li>
                    <li className={`flex-center-vertical gap-12 pad-8 btn ${justify === 'JustifyCenter' ? 'selected' : ''}`} onClick={e => selectStyle(e, 'JustifyCenter')}>
                        <img src={JustifyCenter} className="size-16-16"></img>
                        <span>Align Center</span>
                    </li>
                    <li className={`flex-center-vertical gap-12 pad-8 btn ${justify === 'JustifyRight' ? 'selected' : ''}`} onClick={e => selectStyle(e, 'JustifyRight')}>
                        <img src={JustifyRight} className="size-16-16"></img>
                        <span>Align Right</span>
                    </li>
                </ul>
            </div>
        }
    </div>
}