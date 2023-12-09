import ButtonDropdown from "./ButtonDropdown";
import BulletList from "../images/BulletList.svg";
import { useState } from "react";
import "../styles/bullet-menu.css";

const bulletStyles = [
    'disc',
    'circle',
    'square'
]
interface BulletButtonProps {
    applyStyle: (value: string) => void;
}

export default function BulletButton({ applyStyle }: BulletButtonProps) {
    const [bullet, setBullet] = useState<string>('disc');

    function selectBullet(e: React.MouseEvent, style: string) {
        setBullet(style);
        applyStyle(style);
        e.target.dispatchEvent(new Event('close-dropdown', { bubbles: true }));
    }

    return <ButtonDropdown
        onClick={() => applyStyle(bullet)}
        buttonContent={
            <img className="size-18-18" src={BulletList} draggable="false" />
        }
        menu={
            <div className="bullet-menu dropdown-window pad-8">
                <h5>Bullet Library</h5>
                <div className="bullet-options flex-center-vertical">
                    {
                        bulletStyles.map(style =>
                            <div key={style} className={`bullet-cont flex-center ${bullet === style ? 'selected' : ''}`} onClick={e => selectBullet(e, style)}>
                                <div className={style}></div>
                            </div>
                        )
                    }
                </div>
            </div>
        }></ButtonDropdown>
}