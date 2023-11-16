interface ContextMenu {
    top: number;
    left: number;
    items: ContextMenuItem[];
}

interface ContextMenuItem {
    name: string;
    icon: string;
    action: () => void;
}