interface NavGroup {
    title: string;
    selectedItemId: string;
    updateSelectedItemId: (id: string) => void;
    items?: NavGroupItem[];
    onContextMenu: (e: any, item: NavGroupItem) => void;
    addItemButton: AddItemButton;
    onUpdateOrder: (items: NavGroupItem[]) => void;
    backgroundColor?: string;
    placeHolderItemTitle?: string;
}

type NavGroupItem = Section | Page;

interface AddItemButton {
    title: string;
    onClick: () => void;
}