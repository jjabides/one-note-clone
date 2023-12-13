import ButtonDropdown from "./ButtonDropdown";
import "../styles/highlight-color-menu.css";
import { useState } from "react";

interface HighlightButton {
    applyColor: (color: string) => void;
}

const options = [
    '#ffff00', // yellow
    '#00ff00', // green
    '#00ffff', // cyan
    '#ff00ff', // magenta
    '#0000ff', // blue
    '#ff0000', // red
    '#00008b', // darkblue
    '#008b8b', // darkcyan
    '#006400', // darkgreen
    '#8b008b', // darkmagenta
    '#8b0000', // darkred
    '#b8860b', // darkgoldenrod
    '#808080', // gray
    '#d3d3d3', // lightgray
    '#000000', // black
]

export default function HighlightButton({ applyColor }: HighlightButton) {
    const [color, setColor] = useState<string>('#ffff00');

    function selectColor(e: React.MouseEvent, option: string) {
        setColor(option);
        applyColor(option);
        e.target.dispatchEvent(new Event('close-dropdown', { bubbles: true }))
    }
    

    return <ButtonDropdown
        onClick={() => applyColor(color)}
        tooltip="Highlight"
        buttonContent={
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
                <path type="path" className="" d="M 2048 2048 h -2048 v -307 h 2048 m -177 -1492 q 38 38 57 85 q 18 47 18 97 q 0 49 -18 96 q -19 47 -57 85 l -905 905 l -249 19 v 102 h -615 l 308 -204 l 51 -280 l 71 -72 h -1 l 905 -905 q 38 -38 85 -56 q 47 -19 96 -19 q 50 0 97 19 q 47 18 85 56 m 0 362 q 21 -21 33 -49 q 11 -29 11 -60 q -1 -30 -12 -58 q -11 -28 -32 -50 l -73 -73 q -21 -21 -49 -32 q -29 -12 -59 -12 q -32 1 -60 12 q -28 11 -49 32 l -833 833 l 290 290 z"></path>
                <path type="path" className="" d="M 31 2017 v -245 h 1986 v 245 z"></path>
                <path type="path" fill={color} className="" d="M 2048 1741 v 307 h -2048 v -307 m 1986 62 h -1924 v 183 h 1924 z"></path>
                <path type="path" fill={color} className="highlight-color" d="M 2048 2048 h -2048 v -307 h 2048 z"></path>
                <path type="path" fill="gray" className="" d="M 102 1638 l 308 -204 l 51 -280 l 129 -130 l 376 493 l -249 19 v 102 z"></path>
                <path type="path" fill='transparent' className="" d="M 604 1082 l 869 -869 q 29 -29 66 -44 q 37 -15 79 -15 q 41 0 78 15 q 37 15 66 44 l 73 73 q 29 29 44 66 q 15 37 15 78 q 0 42 -15 79 q -15 37 -44 66 l -869 869 z"></path>
                <path type="path" fill="gray" className="" d="M 1871 249 q 38 38 57 85 q 18 47 18 97 q 0 49 -18 96 q -19 47 -57 85 l -905 905 l -435 -435 l 905 -905 q 38 -38 85 -56 q 47 -19 96 -19 q 50 0 97 19 q 47 18 85 56 m 0 362 q 21 -21 33 -49 q 11 -29 11 -60 q -1 -30 -12 -58 q -11 -28 -32 -50 l -73 -73 q -21 -21 -49 -32 q -29 -12 -59 -12 q -32 1 -60 12 q -28 11 -49 32 l -833 833 l 290 290 z"></path>
            </svg>
        }
        menu={
            <div className="highlight-color-menu dropdown-window">
                <div className="color-options">
                    {options.map(option =>
                        <div key={option} className="color-box" onClick={e => selectColor(e, option)}>
                            <div className="color" style={{ backgroundColor: option }}></div>
                        </div>)}
                </div>
                <div className="separator-cont">
                    <div className="separator"></div>
                </div>
                <div className="no-color" onClick={e => selectColor(e, 'none')}>
                    <div className="no-color-box"></div>
                    <span>No Color</span>
                </div>
            </div>
        }
    ></ButtonDropdown>
}