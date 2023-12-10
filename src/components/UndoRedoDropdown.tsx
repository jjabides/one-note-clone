import Undo from "../images/Undo.svg";
import Redo from "../images/Redo.svg";
import { useEffect, useRef, useState } from "react";
import DropdownButton from "./DropdownButton";
import "../styles/undo-redo-dropdown.css";

interface UndoRedoDropdownProps {
    applyUndoRedo: (command: 'Undo' | 'Redo') => void;
    hasUndo: boolean;
    hasRedo: boolean;
}

export default function UndoRedoDropdown({ applyUndoRedo, hasUndo, hasRedo }: UndoRedoDropdownProps) {
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

    function selectOption(option: 'Undo' | 'Redo') {
        applyUndoRedo(option);
        setOpen(false);
    }

    return <div className="undo-redo-dropdown" ref={dropdownRef as any}>
        <div className={`undo-btn-icon-wrapper flex-center size-32-32 btn ${hasUndo ? '' : 'uninteractive'}`} onClick={() => applyUndoRedo('Undo')}>
            <img src={Undo} className="size-18-18" draggable="false" />
        </div>
        <DropdownButton active={open} onClick={() => setOpen(!open)}></DropdownButton>
        {
            open && <div className="undo-redo-dropdown-menu dropdown-window">
                <ul>
                    <li className={`btn flex-center-vertical gap-8 pad-8 ${hasUndo ? '' : 'uninteractive'}`} onClick={() => selectOption('Undo')}>
                        <img src={Undo} draggable="false" className="size-18-18" />
                        <span>Undo</span>
                    </li>
                    <li className={`btn flex-center-vertical gap-8 pad-8 ${hasRedo ? '' : 'uninteractive'}`} onClick={() => selectOption('Redo')}>
                        <img src={Redo} draggable="false" className="size-18-18"/>
                        <span>Redo</span>
                    </li>
                </ul>
            </div>
        }
    </div>
}