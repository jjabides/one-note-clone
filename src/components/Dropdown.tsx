import { useEffect, useRef, useState } from "react";
import DropdownButton from "./DropdownButton";

interface Dropdown {
    options: string[];
    selectedOption: string;
    setSelectedOption: (option: string) => void;
    width: number;
    borderWidth?: string;
    borderRadius?: string;
}

export default function Dropdown({ options, selectedOption, setSelectedOption, width, borderWidth, borderRadius }: Dropdown) {
    const [open, setOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLElement>()

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


    function selectOption(option: string) {
        setSelectedOption(option);
        setOpen(false);
    }

    return <>
        <div className="dropdown" ref={dropdownRef as any} style={{ width, borderWidth, borderRadius }}>
            <div className="dropdown-value">{selectedOption}</div>
            <DropdownButton active={open} onClick={() => setOpen(!open)}></DropdownButton>
            {
                open && <ul className="dropdown-list dropdown-window">
                    {
                        options.map(option =>
                            <li
                                key={option}
                                className="btn pad-16"
                                style={{ fontFamily: option }}
                                onClick={e => selectOption(option)}
                            >{option}</li>
                        )
                    }
                </ul>
            }
        </div>
    </>
}