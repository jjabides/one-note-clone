import { useState } from "react";
import "../styles/NavGroup.css";

export default function NavGroup({ title, items, selectedItemId, updateSelectedItemId, onContextMenu, addItemButton, onUpdateOrder, backgroundColor, placeHolderItemTitle }: NavGroup) {
    // variables for dragging state
    const [draggedItem, setDraggedItem] = useState<NavGroupItem | null>(null);
    const [mousePosition, setMousePosition] = useState<number | null>(null);
    const [oldIndex, setOldIndex] = useState<number | null>(null);
    const [newIndex, setNewIndex] = useState<number | null>(null);
    const [draggedItemOffset, setDraggedItemOffset] = useState<number>(0);

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

        const offsetTop = 150;
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

    return <div className="nav-group" onMouseUp={onMouseUp} style={{ backgroundColor }}>
        <h1 className="pad-16">{title}</h1>
        <ul onMouseMove={onMouseMove}>
            {
                items && items.map((item, index) => (
                    <li className={`btn pad-8-16 ${item.id === selectedItemId ? 'selected' : ''}`} key={item.id}
                        onClick={() => updateSelectedItemId(item.id)}
                        onMouseDown={(e) => onMouseDown(e, item, index)}
                        onContextMenu={e => onContextMenu(e, item)}
                        style={getSectionStyle(index) as any}>
                        {item.name ? item.name : placeHolderItemTitle }
                    </li>
                ))
            }
            {
                (draggedItem && mousePosition !== null) ?
                    <div className="dragged-item pad-8-16" style={{ top: mousePosition + 'px' }}>
                        {draggedItem.name ? draggedItem.name : placeHolderItemTitle }
                    </div> : ""
            }
        </ul>
        <div
            className="btn pad-12-16"
            onClick={addItemButton.onClick}>
            {addItemButton.title}
        </div>
    </div>
}