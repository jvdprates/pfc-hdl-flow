import {TextInputProps} from './PortTextInput';

type SelectInputProps = Omit<
  TextInputProps,
  'expand' | 'maxLength' | 'placeholder'
> & {
  options: string[];
};

function PortSelectInput({
  id,
  label,
  onChange,
  value,
  options,
  className,
  labelClassName,
  required,
  disabled,
}: SelectInputProps) {
  return (
    <>
      <label
        htmlFor={id}
        className={`text-sm font-semibold text-gray-600 ${labelClassName}`}>
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={event => {
          event.preventDefault();
          onChange(event.target.value);
        }}
        className={`input-canvas hover:cursor-pointer appearance-none ${className}`}
        required={required}
        disabled={disabled}>
        {options.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </>
  );
}

export default PortSelectInput;
