import ButtonDropdown from "./ButtonDropdown";
import "../styles/font-color-menu.css";
import { useState } from "react";

const row1Colors = [
    '#ffffff',
    '#000000',
    '#EEECE1',
    '#1F497D',
    '#4F81BD',
    '#C0504D',
    '#9BBB59',
    '#8064A2',
    '#4BACC6',
    '#F79646'
]

const row2Colors = [
    '#C00000',
    '#FF0000',
    '#FFC000',
    '#FFFF00',
    '#92D050',
    '#00B050',
    '#00B0F0',
    '#0070C0',
    '#002060',
    '#7030A0',
]

interface FontColorButtonProps {
    applyColor: (color: string) => void;
}

export default function FontColorButton({ applyColor }: FontColorButtonProps) {
    const [color, setColor] = useState<string>('#000000');

    function selectColor(e: React.MouseEvent, option: string) {
        applyColor(option);
        setColor(option);
        e.target.dispatchEvent(new Event('close-dropdown', { bubbles: true }))
    }

    return <ButtonDropdown
        onClick={() => applyColor(color)}
        buttonContent={
            <svg viewBox="0,0,2048,2048" focusable="false">
                <path type="path" d="M 2048 2048 h -2048 v -512 h 2048 m -589 -102 l -147 -410 h -571 l -143 410 h -137 l 507 -1332 h 124 l 504 1332 m -569 -1169 h -4 l -240 658 h 487 z"></path>
                <path type="path" d="M 51 1997 v -410 h 1946 v 410 z"></path>
                <path type="path" d="M 2048 1536 v 512 h -2048 v -512 m 1946 102 h -1844 v 308 h 1844 z"></path>
                <path type="path" fill={color} d="M 2048 1536 v 512 h -2048 v -512 z"></path>
                <path type="path" d="M 1459 1434 l -147 -410 h -571 l -143 410 h -137 l 507 -1332 h 124 l 504 1332 m -569 -1169 h -4 l -240 658 h 487 z"></path>
            </svg>
        }
        menu={
            <div className="font-color-menu dropdown-window">
                <div className="row-1 row">
                    {row1Colors.map(color =>
                        <div className="color-box" key={color} onClick={e => selectColor(e, color)}>
                            <div className="color" style={{ backgroundColor: color, border: color === '#ffffff' ? '1px solid rgba(0, 0, 0, 0.4)' : '' }}></div>
                        </div>
                    )}
                </div>
                <div className="separator-cont">
                    <div className="separator"></div>
                </div>
                <h5 className="pad-8">
                    Standard Colors
                </h5>
                <div className="row-2 row">
                    {row2Colors.map(color =>
                        <div className="color-box" key={color} onClick={e => selectColor(e, color)}>
                            <div className="color" style={{ backgroundColor: color, border: color === '#ffffff' ? '1px solid rgba(0, 0, 0, 0.4)' : '' }}></div>
                        </div>
                    )}
                </div>
            </div>
        }
    ></ButtonDropdown>
}