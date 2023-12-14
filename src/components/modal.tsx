import "../styles/modal.css";
import Close from "../images/Close.svg";

function submitHelper(e: any, onSubmit: (value: string) => void) {
    e.preventDefault();
    onSubmit(e.target[0].value);
}

export default function Modal({ 
    title, 
    description, 
    onSubmit, 
    onCancel, 
    confirmBtnTitle, 
    cancelBtnTitle, 
    input, 
    inputValue }: Modal) {
    return <div className="modal">
        <div className="modal-header">
            <div className="close btn size-32-32 flex-center" onClick={onCancel}>
                <img src={Close} draggable="false" className="size-10-10" />
            </div>
        </div>
        <div className="modal-title">{title}</div>
        <form className="modal-form" onSubmit={e => submitHelper(e, onSubmit)}>
            <div>
                <div className="description">{description}</div>
                {
                    input && <input type="text" defaultValue={inputValue} autoFocus={true}/>
                }
            </div>
            <div className="flex-center-vertical align-right gap-8">
                <button className="confirm-btn modal-btn pad-0-8">{confirmBtnTitle ? confirmBtnTitle : 'OK' }</button>
                <button type="reset" className="cancel-btn modal-btn" onClick={onCancel}>{cancelBtnTitle ? cancelBtnTitle : 'Cancel'}</button>
            </div>
        </form>
    </div>
}