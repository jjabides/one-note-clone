import { useEffect, useRef, useState } from "react";
import "../styles/button-dropdown.css";
import DropdownButton from "./DropdownButton";
import { Props } from "tippy.js";
import { ribbonTippyProps } from "../utilities/tippyProps";
import Tooltip from "./Tooltip";

interface ButtonDropdown {
    onClick: () => void;
    buttonContent: any;
    menu: React.ReactElement;
    tooltip: string;
}

export default function ButtonDropdown({ buttonContent, menu, onClick, tooltip }: ButtonDropdown) {
    const [open, setOpen] = useState<boolean>(false);
    const buttonDropdownRef = useRef<HTMLDivElement>();
    const tippyProps = useRef<Props>(ribbonTippyProps)

    useEffect(() => {
        window.addEventListener('click', onWindowClick)
        buttonDropdownRef.current?.addEventListener('close-dropdown', onCloseButtonDropdown)
    }, []);

    useEffect(() => {
        return () => {
            window.removeEventListener('click', onWindowClick);
            buttonDropdownRef.current?.removeEventListener('close-dropdown', onCloseButtonDropdown)
        }
    }, []);

    function onWindowClick(e: MouseEvent) {
        let currentEL: HTMLElement = e.target as HTMLElement;

        // Hide dropdown if click is outside of dropdown element
        while (currentEL) {
            if (currentEL === buttonDropdownRef.current) {
                return;
            }
            currentEL = currentEL.parentElement as HTMLElement;
        }
        setOpen(false);
    }

    function onCloseButtonDropdown() {
        setOpen(false);
    }

    return <div className="button-dropdown" ref={buttonDropdownRef as any}>
        <Tooltip props={{...tippyProps.current, content: tooltip }}>
            <div className="execute-btn btn border-radius-4-0-0-4" onClick={onClick}>
                {buttonContent}
            </div>
        </Tooltip>
        <DropdownButton active={open} onClick={() => setOpen(!open)}></DropdownButton>
        {open && menu}
    </div>
}