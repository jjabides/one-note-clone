import { useState, useRef, useEffect } from "react";
import Ellipsis from "../images/Ellipsis.svg";
import Subscript from "../images/Subscript.svg";
import Superscript from "../images/Superscript.svg";
import Strikethrough from "../images/Strikethrough.svg";
import "../styles/font-style-button.css";

type FontStyle = 'Subscript' | 'Superscript' | 'Strikethrough';

interface FontButtonProps {
    applyStyle: (style: FontStyle) => void;
}

export default function FontStyleButton({ applyStyle }: FontButtonProps) {
    const [open, setOpen] = useState<boolean>(false);
    const fontBtnRef = useRef<HTMLElement>()

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

    function selectFontStyle(style: FontStyle) {
        applyStyle(style);
        setOpen(false);
    }

    return <div className="font-style-button size-32-32" ref={fontBtnRef as any}>
        <div className={`btn size-32-32 flex-center ${open ? 'selected' : ''}`} onClick={() => setOpen(!open)}>
            <img src={Ellipsis} draggable="false" className="size-18-18"/>
        </div>
        {
            open && <div className="font-style-menu dropdown-window">
                <h5>Font</h5>
                <ul>
                    <li className="flex-center-vertical btn" onClick={() => selectFontStyle('Subscript')}>
                        <img src={Subscript} className="size-16-16"/>
                        <span>Subscript</span>
                    </li>
                    <li className="flex-center-vertical btn" onClick={() => selectFontStyle('Superscript')}> 
                        <img src={Superscript} className="size-16-16"/>
                        <span>Superscript</span>
                    </li>
                    <li className="flex-center-vertical btn" onClick={() => selectFontStyle('Strikethrough')}>
                        <img src={Strikethrough} className="size-16-16"/>
                        <span>Strikethrough</span>
                    </li>
                </ul>
            </div>
        }
    </div>
}