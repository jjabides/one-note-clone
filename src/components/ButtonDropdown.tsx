import { useEffect, useRef, useState } from "react";
import "../styles/button-dropdown.css";
import DropdownButton from "./DropdownButton";

interface ButtonDropdown {
    onClick: () => void;
    buttonContent: any;
    menu: React.ReactElement;
}

export default function ButtonDropdown({ buttonContent, menu, onClick }: ButtonDropdown) {
    const [open, setOpen] = useState<boolean>(false);
    const buttonDropdownRef = useRef<HTMLDivElement>();

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
        <div className="execute-btn btn" onClick={onClick}>
            { buttonContent }
        </div>
        <DropdownButton active={open} onClick={() => setOpen(!open)}></DropdownButton>
        { open && menu }
    </div>
}