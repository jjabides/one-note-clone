import { useEffect, useRef, useState } from "react";
import Arrow_No_Tail from "../images/Arrow_No_Tail.svg";

const options = [
    'Calibri',
    'Arial',
    'Comic Sans MS',
    'Consolas',
    'Corbel',
    'Courier New',
    'Georgia',
    'Segoe UI',
    'Tahoma',
    'Times New Roman',
    'Verdana',
];

export default function FontDropdown() {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>('Calibri');
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
        setValue(option);
        setOpen(false);
    }

    return <>
        <div className="font-dropdown" ref={dropdownEl as any}>
            <div className="dropdown-value">{value}</div>
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