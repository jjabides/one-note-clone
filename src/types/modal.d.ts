
interface Modal {
    title: string,
    description: string;
    onSubmit: (value: string) => void;
    onCancel?: () => void;
    icon?: string;
    input?: boolean;
    inputValue?: string;
    confirmBtnTitle?: string;
    cancelBtnTitle?: string;
}