interface InputProps {
    type: string
    label: string,
    value?: string,
    placeholder?: string,
    accept?: string
    className: string,
    handleChange: (value: string | File | null) => void;
}

const Input: React.FC<InputProps> = ({label, type, handleChange, value, placeholder, accept, className}) => {
    return(
        <div className={className}>
            <label>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                accept={accept}
            />
        </div>
    )
};

export default Input;