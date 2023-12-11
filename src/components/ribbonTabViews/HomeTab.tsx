import BulletButton from "../BulletButton";
import ClearFormattingButton from "../ClearFormattingButton";
import ClipboardDropdown from "../ClipboardDropdown";
import Dropdown from "../Dropdown";
import FontColorButton from "../FontColorButton";
import FontStyleButton from "../FontStyleButton";
import HighlightButton from "../HighlightButton";
import IndentButton from "../IndentButton";
import JustifyButton from "../JustifyButton";
import OutdentButton from "../OutdentButton";
import ToggleButton from "../ToggleButton";
import UndoRedoDropdown from "../UndoRedoDropdown";
import { Editor as TinyMCEEditor } from "tinymce";
import Bold from "../../images/Bold.svg";
import Italic from "../../images/Italic.svg";
import Underline from "../../images/Underline.svg";
import AlphaNumericButton from "../AlphaNumericButton";

interface HomeTabProps {
    state: RibbonState;
    editorRef: React.MutableRefObject<TinyMCEEditor | undefined>;
    setState: React.Dispatch<React.SetStateAction<RibbonState>>;
}

const fonts = [
    'Arial',
    'Calibri',
    'Comic Sans MS',
    'Consolas',
    'Corbel',
    'Courier New',
    'Georgia',
    'Segoe UI',
    'Tahoma',
    'Times New Roman',
    'Verdana',
];

const fontSizes = [
    '8pt',
    '10pt',
    '11pt',
    '12pt',
    '14pt',
    '16pt',
    '18pt',
    '24pt',
    '36pt',
    '48pt'
]

export default function HomeTab({ editorRef, state, setState }: HomeTabProps) {
    function updateFontFamily(value: string) {
        if (!editorRef.current) return;
        editorRef.current.execCommand('FontName', false, value);
        setState((oldState) => ({
            ...oldState,
            fontFamily: value,
        }))
    }

    function updateFontSize(value: string) {
        if (!editorRef.current) return;
        editorRef.current.execCommand('FontSize', false, value);
        setState((oldState) => ({
            ...oldState,
            fontSize: value
        }))
    }

    function updateBold() {
        if (!editorRef.current) return;
        editorRef.current.execCommand('Bold');
        setState((oldState) => ({
            ...oldState,
            bold: !state.bold
        }))
    }

    function updateItalic() {
        if (!editorRef.current) return;
        editorRef.current.execCommand('Italic');
        setState((oldState) => ({
            ...oldState,
            italic: !state.italic
        }))
    }

    function updateUnderline() {
        if (!editorRef.current) return;
        editorRef.current.execCommand('Underline');
        setState((oldState) => ({
            ...oldState,
            underline: !state.underline
        }))
    }

    function applyHighlight(color: string) {
        if (!editorRef.current) return;
        editorRef.current.execCommand('BackColor', false, color)
    }

    function applyFontColor(color: string) {
        if (!editorRef.current) return;
        editorRef.current.execCommand('ForeColor', false, color)
    }

    function clearFormatting() {
        if (!editorRef.current) return;
        editorRef.current.execCommand('RemoveFormat')
    }

    function applyFontStyle(style: string) {
        if (!editorRef.current) return;
        editorRef.current.execCommand(style);
    }

    function applyBullet(style: string) {
        if (!editorRef.current) return;
        editorRef.current.execCommand('InsertUnorderedList', false, {
            'list-style-type': style,
        })
    }

    function applyOutdent() {
        if (!editorRef.current) return;
        editorRef.current.execCommand('Outdent');
    }

    function applyIndent() {
        if (!editorRef.current) return;
        editorRef.current.execCommand('Indent');
    }

    function applyJustify(style: string) {
        if (!editorRef.current) return;
        editorRef.current.execCommand(style);
    }

    function executeUndoRedo(command: 'Undo' | 'Redo') {
        if (!editorRef.current) return;
        editorRef.current.execCommand(command);
    }

    function applyClipboardAction(action: ClipboardAction) {
        if (!editorRef.current) return;
        editorRef.current.execCommand(action);
    }

    function applyAlphaNumericList(style: string) {
        if (!editorRef.current) return;
        editorRef.current.execCommand('InsertOrderedList', false, {
            'list-style-type': style,
        })
    }

    return <>
        <span>
            <UndoRedoDropdown applyUndoRedo={executeUndoRedo} hasUndo={state.hasUndo} hasRedo={state.hasRedo}></UndoRedoDropdown>
            <ClipboardDropdown applyClipboardAction={applyClipboardAction} canCopy={state.textSelection.length > 0} canCut={state.textSelection.length > 0}></ClipboardDropdown>
        </span>
        <span className="vertical-separator"></span>
        <span>
            <Dropdown
                selectedOption={state.fontFamily}
                setSelectedOption={updateFontFamily}
                width={128}
                options={fonts}
                borderRadius='4px 0px 0px 4px'></Dropdown>
            <Dropdown
                options={fontSizes}
                setSelectedOption={updateFontSize}
                selectedOption={state.fontSize}
                width={64}
                borderWidth='1px 1px 1px 0px'
                borderRadius='0px 4px 4px 0px'
            ></Dropdown>
        </span>
        <span>
            <ToggleButton
                icon={Bold}
                onClick={updateBold}
                active={state.bold}
                iconSize={16}
            ></ToggleButton>
            <ToggleButton
                icon={Italic}
                onClick={updateItalic}
                active={state.italic}
                iconSize={16}
            ></ToggleButton>
            <ToggleButton
                icon={Underline}
                onClick={updateUnderline}
                active={state.underline}
                iconSize={16}
            ></ToggleButton>
            <HighlightButton applyColor={applyHighlight}></HighlightButton>
            <FontColorButton applyColor={applyFontColor}></FontColorButton>
            <ClearFormattingButton onClick={clearFormatting}></ClearFormattingButton>
            <FontStyleButton applyStyle={applyFontStyle}></FontStyleButton>
        </span>
        <span className="vertical-separator"></span>
        <span>
            <BulletButton applyStyle={applyBullet}></BulletButton>
            <AlphaNumericButton applyStyle={applyAlphaNumericList}></AlphaNumericButton>
            <OutdentButton onClick={applyOutdent}></OutdentButton>
            <IndentButton onClick={applyIndent}></IndentButton>
            <JustifyButton applyStyle={applyJustify}></JustifyButton>
        </span>
    </>
}