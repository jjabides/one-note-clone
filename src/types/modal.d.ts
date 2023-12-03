
interface Modal {
    title: string,
    description: string;
    onSubmit: (e: any) => void;
    onCancel?: () => void;
    icon?: string;
    input?: boolean;
    inputValue?: string;
    confirmBtnTitle?: string;
    cancelBtnTitle?: string;
}