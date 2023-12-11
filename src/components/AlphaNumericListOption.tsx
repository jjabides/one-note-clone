import "../styles/alpha-numeric-list-option.css";

interface AlphaNumericListOptionProps {
    listStyle: string;
}

export default function AlphaNumericListOption({ listStyle }: AlphaNumericListOptionProps) {

    return <div className="alpha-numeric-list-option">
        <ol style={{ listStyle }}>
            <li>
                <span className="line"></span>
            </li>
            <li>
                <span className="line"></span>
            </li>
            <li>
                <span className="line"></span>
            </li>
        </ol>
    </div>
}