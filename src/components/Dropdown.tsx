import { useEffect, useRef, useState } from "react";
import Arrow_No_Tail from "../images/Arrow_No_Tail.svg";

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
    const dropdownEl = useRef<HTMLElement>()

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
            if (currentEL === dropdownEl.current) {
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
        <div className="dropdown" ref={dropdownEl as any} style={{ width, borderWidth, borderRadius }}>
            <div className="dropdown-value">{selectedOption}</div>
            <div className={`dropdown-btn btn ${open ? 'selected' : ''}`} onClick={() => setOpen(!open)}>
                <img src={Arrow_No_Tail} />
            </div>
            {
                open && <ul className="dropdown-list">
                    {
                        options.map(option =>
                            <li
                                key={option}
                                className="btn"
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