
function submitHelper(e: any, onSubmit: (value: string) => void) {
    e.preventDefault();
    onSubmit(e.target[0].value);
}

export default function Modal({ title, description, onSubmit, onCancel, confirmBtnTitle, cancelBtnTitle, input, inputValue }: Modal) {
    return <div className="modal pad-16">
        <h2 className="title">{title}</h2>
        <form onSubmit={e => submitHelper(e, onSubmit)}>
            <div className="description">{description} </div>
            {
                input && <input type="text" defaultValue={inputValue}/>
            }
            <button className="confirm-btn">{ confirmBtnTitle ? confirmBtnTitle : 'Confirm' }</button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>{ cancelBtnTitle ? cancelBtnTitle : 'Cancel' }</button>
        </form>
    </div>
}