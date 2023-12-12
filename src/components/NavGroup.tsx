import { useState } from "react";
import "../styles/NavGroup.css";
import Section_Icon from "../images/Section_Icon.svg";
import CustomScrollbar from "./CustomScrollbar";

export default function NavGroup({
    items,
    selectedItemId,
    updateSelectedItemId,
    onContextMenu,
    addItemButton,
    onUpdateOrder,
    backgroundColor,
    placeHolderItemTitle }: NavGroup) {

    // variables for dragging state
    const [draggedItem, setDraggedItem] = useState<NavGroupItem | null>(null);
    const [mousePosition, setMousePosition] = useState<number | null>(null);
    const [oldIndex, setOldIndex] = useState<number | null>(null);
    const [newIndex, setNewIndex] = useState<number | null>(null);
    const [draggedItemOffset, setDraggedItemOffset] = useState<number>(0);

    const [hover, setHover] = useState<boolean>(false);

    function onMouseDown(e: any, item: NavGroupItem, index: number) {
        setDraggedItemOffset(e.nativeEvent.offsetY);
        setDraggedItem(item);
        setOldIndex(index);
        setNewIndex(index);
    }

    function onMouseUp() {
        updateOrder();
        setDraggedItemOffset(0);
        setDraggedItem(null);
        setMousePosition(null);
        setNewIndex(null);
    }

    function onMouseMove(e: any) {
        if (!draggedItem || !items) return;
        e.preventDefault();

        const offsetTop = 190; // Offset from top of screen to ul
        const y = e.clientY - offsetTop - draggedItemOffset;
        let index = y / 40;
        if (index < 0) index = 0;
        if (index > items.length - 1) index = items.length - 1;

        setNewIndex(Math.round(index));
        setMousePosition(y);
    }

    function updateOrder() {
        if (newIndex === null || oldIndex === null || newIndex === oldIndex || !items) return;

        let newItems = [...items];
        if (newIndex < oldIndex) {
            for (let i = oldIndex; i > newIndex; i--) {
                let swap = newItems[i];
                newItems[i] = newItems[i - 1];
                newItems[i - 1] = swap;
            }
        } else {
            for (let i = oldIndex; i < newIndex; i++) {
                let swap = newItems[i];
                newItems[i] = newItems[i + 1];
                newItems[i + 1] = swap;
            }
        }

        onUpdateOrder(newItems);
    }

    function getSectionStyle(index: number) {
        if (oldIndex === null || newIndex === null || !draggedItem) return null;

        let baseStyle = {
            pointerEvents: draggedItem && mousePosition !== null ? 'none' : 'auto',
            transition: 'background-color .2s, transform .3s'
        }

        if (index === oldIndex && mousePosition !== null) {
            return {
                ...baseStyle,
                visibility: 'hidden',
            }
        }

        if (index > oldIndex && newIndex >= index) {
            return {
                ...baseStyle,
                transform: 'translateY(-40px)',
            }
        }
        if (index < oldIndex && newIndex <= index) {
            return {
                ...baseStyle,
                transform: 'translateY(40px)'
            }
        }

        return baseStyle;
    }

    function getIconColor(item: NavGroupItem) {
        return (item as Section).iconColor ? (item as Section).iconColor : 'transparent';
    }

    return <div className="nav-group"
        onMouseUp={onMouseUp}
        style={{ backgroundColor }}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}>
        <CustomScrollbar showScroll={hover}>
            <ul onMouseMove={onMouseMove}>
                {
                    items && items.map((item, index) => (
                        <li className={`btn flex-center-vertical gap-8 pad-8 ${item.id === selectedItemId ? 'selected' : ''}`} key={item.id}
                            onClick={() => updateSelectedItemId(item.id)}
                            onMouseDown={(e) => onMouseDown(e, item, index)}
                            onContextMenu={e => onContextMenu(e, item)}
                            style={getSectionStyle(index) as any}>
                            {
                                (item as Section).iconColor &&
                                <div className="size-18-18 flex-center">
                                    <svg
                                        width="9.541153"
                                        height="31.957813"
                                        viewBox="0 0 9.541153 31.957813">
                                        <g
                                            id="layer1"
                                            transform="translate(-10.80613,-0.03846902)">
                                            <path
                                                id="rect1"
                                                stroke={getIconColor(item)}
                                                fill={getIconColor(item)}
                                                strokeWidth={1}
                                                strokeLinecap="round"
                                                d="m 15.876034,0.64194783 h 2.5266 V 31.353429 h -2.5266 a 4.5813814,4.5813814 45 0 1 -4.581381,-4.581381 l 0,-21.5487188 a 4.5813814,4.5813814 135 0 1 4.581381,-4.58138137 z"
                                                transform="matrix(0.82996497,0,0,0.87964339,1.8493892,1.9285799)" />
                                            <rect
                                                stroke={getIconColor(item)}
                                                fill={getIconColor(item)}
                                                strokeWidth={1}
                                                strokeLinecap="round"
                                                id="rect2"
                                                width="2.3215201"
                                                height="30.945873"
                                                x="17.519793"
                                                y="0.54443902" />
                                        </g>
                                    </svg>
                                </div>
                            }
                            <span className="ellipsis">
                                {item.name ? item.name : placeHolderItemTitle}
                            </span>
                        </li>
                    ))
                }
                {
                    (draggedItem && mousePosition !== null) ?
                        <div className="dragged-item pad-8 gap-8 flex-center-vertical" style={{ top: mousePosition + 'px' }}>
                            {
                                (draggedItem as Section).iconColor &&
                                <div className="size-18-18 flex-center">
                                    <svg
                                        width="9.541153"
                                        height="31.957813"
                                        viewBox="0 0 9.541153 31.957813">
                                        <g
                                            id="layer1"
                                            transform="translate(-10.80613,-0.03846902)">
                                            <path
                                                id="rect1"
                                                stroke={getIconColor(draggedItem)}
                                                fill={getIconColor(draggedItem)}
                                                strokeWidth={1}
                                                strokeLinecap="round"
                                                d="m 15.876034,0.64194783 h 2.5266 V 31.353429 h -2.5266 a 4.5813814,4.5813814 45 0 1 -4.581381,-4.581381 l 0,-21.5487188 a 4.5813814,4.5813814 135 0 1 4.581381,-4.58138137 z"
                                                transform="matrix(0.82996497,0,0,0.87964339,1.8493892,1.9285799)" />
                                            <rect
                                                stroke={getIconColor(draggedItem)}
                                                fill={getIconColor(draggedItem)}
                                                strokeWidth={1}
                                                strokeLinecap="round"
                                                id="rect2"
                                                width="2.3215201"
                                                height="30.945873"
                                                x="17.519793"
                                                y="0.54443902" />
                                        </g>
                                    </svg>
                                </div>
                            }
                            <span className="ellipsis">
                                {draggedItem.name ? draggedItem.name : placeHolderItemTitle}
                            </span>
                        </div> : ""
                }
            </ul>
        </CustomScrollbar>
        <div
            className="btn pad-12-16"
            onClick={addItemButton.onClick}>
            {addItemButton.title}
        </div>
    </div>
}