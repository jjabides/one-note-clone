interface NavGroup {
    selectedItemId: string;
    updateSelectedItemId: (id: string) => void;
    items?: NavGroupItem[];
    onContextMenu: (e: any, item: NavGroupItem) => void;
    addItemButton: AddItemButton;
    onUpdateOrder: (items: NavGroupItem[]) => void;
    placeHolderItemTitle?: string;
}

type NavGroupItem = Section | Page;

interface AddItemButton {
    title: string;
    onClick: () => void;
}