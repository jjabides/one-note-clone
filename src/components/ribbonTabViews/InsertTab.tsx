import InsertTableButton from "../InsertTableButton";
import { Editor as TinyMCEEditor } from "tinymce";

interface InsertTabProps {
    state: RibbonState;
    editorRef: React.MutableRefObject<TinyMCEEditor | undefined>;
    setState: React.Dispatch<React.SetStateAction<RibbonState>>;
}

export default function InsertTab({ editorRef }: InsertTabProps) {

    function insertTable(rowSize: number, colSize: number) {
        if (!editorRef.current) return;
        editorRef.current.execCommand('mceInsertTable', false, { rows: rowSize, columns: colSize })
    }

    return <>
    <span>
        <InsertTableButton insertTable={insertTable}></InsertTableButton>
    </span>
    </>
}