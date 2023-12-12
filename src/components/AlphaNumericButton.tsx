import { useState, useRef, useEffect } from "react";
import ButtonDropdown from "./ButtonDropdown";
import AlphaNumericListOption from "./AlphaNumericListOption";
import NumberList from "../images/NumberList.svg"

interface AlphaNumericButtonProps {
    applyStyle: (style: string) => void;
    listStyle: string;
}

const alphaNumericOptions = [
    'decimal',
    'lower-alpha',
    'lower-roman',
    'upper-alpha',
    'upper-roman',
]

export default function AlphaNumericButton({ applyStyle, listStyle }: AlphaNumericButtonProps) {
    const [alphaNumericList, setAlphaNumericList] = useState<string>('decimal');

    useEffect(() => {
        setAlphaNumericList(listStyle === '' ? 'decimal' : listStyle)
    }, [listStyle])

    function selectStyle(e: React.MouseEvent, style: string) {
        setAlphaNumericList(style);
        applyStyle(style);
        e.target.dispatchEvent(new Event('close-dropdown', { bubbles: true }));
    }

    return <ButtonDropdown
        onClick={() => applyStyle(alphaNumericList)}
        buttonContent={
            <img className="size-18-18" src={NumberList} draggable="false" />
        }
        menu={
            <div className="alpha-numeric-menu dropdown-window pad-8">
                <h5 className="pad-4">Numbering Library</h5>
                <div className="alpha-numeric-options flex-center-vertical">
                    {
                        alphaNumericOptions.map((style) =>
                            <div 
                            className={`alpha-numeric-option-wrapper ${listStyle === style ? 'selected' : ''}`} 
                            key={style} 
                            onClick={e => selectStyle(e, style)}>
                                <AlphaNumericListOption listStyle={style}></AlphaNumericListOption>
                            </div>)
                    }
                </div>
            </div>
        }></ButtonDropdown>
}