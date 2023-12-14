import { useEffect, useRef, useState } from "react";
import Clipboard from "../images/Clipboard.svg";
import Cut from "../images/Cut.svg";
import Copy from "../images/Copy.svg"
import Paste from "../images/Paste.svg";
import Arrow_No_Tail from "../images/Arrow_No_Tail.svg";
import Tooltip from "./Tooltip";
import { Props } from "tippy.js";
import { ribbonTippyProps } from "../utilities/tippyProps";

interface ClipboardDropdownProps {
    applyClipboardAction: (action: ClipboardAction) => void;
    canCopy: boolean;
    canCut: boolean;
}

export default function ClipboardDropdown({ applyClipboardAction, canCut, canCopy }: ClipboardDropdownProps) {
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

    function selectOption(option: ClipboardAction) {
        applyClipboardAction(option);
        setOpen(false);
    }

    return <div className="clipboard-dropdown position-relative" ref={dropdownRef as any}>
        <Tooltip props={{ ...tippyProps.current, content: 'Clipboard' }}>
            <div className="btn grid-auto-auto border-radius-4" onClick={() => setOpen(!open)}>
                <div className="clipboard-icon-wrapper flex-center size-28-32">
                    <img src={Clipboard} draggable="false" className="size-18-18" />
                </div>
                <div className="dropdown-arrow-wrapper flex-center size-18-32">
                    <img src={Arrow_No_Tail} className="size-10-10" draggable="false" style={{ rotate: '180deg' }} />
                </div>
            </div>
        </Tooltip>
        {
            open &&
            <div className="clipboard-menu dropdown-window">
                <ul>
                    <li
                        className={`pad-8 btn flex-center-vertical gap-8 ${!canCut ? 'uninteractive' : ''}`}
                        onClick={() => selectOption('Cut')}>
                        <img className="size-18-18" src={Cut} draggable="false" />
                        <span>Cut</span>
                    </li>
                    <li
                        className={`pad-8 btn flex-center-vertical gap-8 ${!canCopy ? 'uninteractive' : ''}`}
                        onClick={() => selectOption('Copy')}>
                        <img className="size-18-18" src={Copy} draggable="false" />
                        <span>Copy</span>
                    </li>
                    <li
                        className="pad-8 btn flex-center-vertical gap-8"
                        onClick={() => selectOption('Paste')}>
                        <img className="size-18-18" src={Paste} draggable="false" />
                        <span>Paste</span>
                    </li>
                </ul>
            </div>
        }

    </div>
}