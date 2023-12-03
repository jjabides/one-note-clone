

export default function Modal({ title, description, onSubmit, onCancel, confirmBtnTitle, cancelBtnTitle, input }: Modal) {
    return <div className="modal pad-16">
        <h2 className="title">{title}</h2>
        <form onSubmit={onSubmit}>
            <div className="description">{description} </div>
            {
                input && <input type="text" />
            }
            <button className="confirm-btn">{ confirmBtnTitle ? confirmBtnTitle : 'Confirm' }</button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>{ cancelBtnTitle ? cancelBtnTitle : 'Cancel' }</button>
        </form>
    </div>
}