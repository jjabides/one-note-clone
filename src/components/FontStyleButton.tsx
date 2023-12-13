import { useState, useRef, useEffect } from "react";
import Ellipsis from "../images/Ellipsis.svg";
import Subscript from "../images/Subscript.svg";
import Superscript from "../images/Superscript.svg";
import Strikethrough from "../images/Strikethrough.svg";
import "../styles/font-style-button.css";
import Tooltip from "./Tooltip";
import { Props } from "tippy.js";
import { ribbonTippyProps } from "../utilities/tippyProps";

interface FontButtonProps {
    applyStyle: (style: string) => void;
    subscript: boolean;
    superscript: boolean;
    strikethrough: boolean;
}

export default function FontStyleButton({ applyStyle, subscript, superscript, strikethrough }: FontButtonProps) {
    const [open, setOpen] = useState<boolean>(false);
    const fontBtnRef = useRef<HTMLElement>()
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
            if (currentEL === fontBtnRef.current) {
                return;
            }
            currentEL = currentEL.parentElement as HTMLElement;
        }
        setOpen(false);
    }

    function selectFontStyle(style: string) {
        applyStyle(style);
        setOpen(false);
    }

    return <div className="font-style-button size-32-32" ref={fontBtnRef as any}>
        <Tooltip props={{ ...tippyProps.current, content: 'Font' }}>
            <div className={`btn size-32-32 flex-center ${open ? 'selected' : ''}`} onClick={() => setOpen(!open)}>
                <img src={Ellipsis} draggable="false" className="size-18-18" />
            </div>
        </Tooltip>
        {
            open && <div className="font-style-menu dropdown-window">
                <h5>Font</h5>
                <ul>
                    <li className={`flex-center-vertical btn ${subscript && 'selected'}`} onClick={() => selectFontStyle('Subscript')}>
                        <img src={Subscript} className="size-16-16" />
                        <span>Subscript</span>
                    </li>
                    <li className={`flex-center-vertical btn ${superscript && 'selected'}`} onClick={() => selectFontStyle('Superscript')}>
                        <img src={Superscript} className="size-16-16" />
                        <span>Superscript</span>
                    </li>
                    <li className={`flex-center-vertical btn ${strikethrough && 'selected'}`} onClick={() => selectFontStyle('Strikethrough')}>
                        <img src={Strikethrough} className="size-16-16" />
                        <span>Strikethrough</span>
                    </li>
                </ul>
            </div>
        }
    </div>
}