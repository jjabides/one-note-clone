

export default function Modal({ title, description, onSubmit }: Modal) {
    return <div className="modal pad-16">
        <h2 className="title">{title}</h2>
        <form onSubmit={onSubmit}>
            <div className="description">{description} </div>
            <input type="text" />
        </form>
    </div>
}