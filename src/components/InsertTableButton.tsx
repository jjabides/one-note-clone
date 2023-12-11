import Table from "../images/Table.svg";
import Arrow_No_Tail from "../images/Arrow_No_Tail.svg";
import { useState, useRef, useEffect } from "react";
import "../styles/insert-table-button.css";

interface InsertTableButtonProps {
    insertTable: (rowCount: number, colCount: number) => void;
}

export default function InsertTableButton({ insertTable }: InsertTableButtonProps) {
    const [open, setOpen] = useState<boolean>(false);
    const buttonDropdownRef = useRef<HTMLDivElement>();
    const [rowSize, setRowSize] = useState(0);
    const [colSize, setColSize] = useState(0);

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

    useEffect(() => {
        if (open) {
            // Reset row/col sizes upon opening menu
            setRowSize(0);
            setColSize(0);
        }
    }, [open])

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

    function updateTable(rowIndex: number, colIndex: number) {
        setRowSize(rowIndex + 1);
        setColSize(colIndex + 1);
    }

    function selectTableSize(rowCount: number, colCount: number) {
        insertTable(rowCount, colCount);
        setOpen(false);
    }

    function isCellSelected(rowIndex: number, colIndex: number) {
        if (rowIndex <= rowSize - 1 && colIndex <= colSize - 1) return true;
        return false;
    }

    return <div className="insert-table-button" ref={buttonDropdownRef as any}>
        <div className="button-wrapper btn grid-auto-auto border-radius-4" onClick={() => setOpen(!open)}>
            <div className="icon-wrapper flex-center gap-6 pad-0-8">
                <img className="size-18-18" src={Table} draggable="false" />
                Table
            </div>
            <div className="icon-wrapper size-16-32 flex-center">
                <img className="size-10-10" src={Arrow_No_Tail} draggable="false" style={{ rotate: '180deg' }} />
            </div>
        </div>
        {
            open && <div className="insert-table-menu dropdown-window pad-8">
                <h5 className="pad-4">{
                    rowSize === 0 ? 'Table Size' : `${colSize}x${rowSize} Table`
                }</h5>
                <div className="table-selector">
                    {
                        [...new Array(8)].map((row, rowIndex) =>
                            <div className="row">
                                {
                                    [...new Array(10)].map((col, colIndex) =>
                                        <span
                                            className={`grid-cell size-16-16 ${isCellSelected(rowIndex, colIndex) ? 'selected' : ''}`}
                                            onMouseOver={() => updateTable(rowIndex, colIndex)}
                                            onClick={() => selectTableSize(rowIndex + 1, colIndex + 1)}></span>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        }
    </div>
}