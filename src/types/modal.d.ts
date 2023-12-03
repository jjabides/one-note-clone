
interface Modal {
    title: string,
    description: string;
    onSubmit: (e: any) => void;
    onCancel?: () => void;
    icon?: string;
}