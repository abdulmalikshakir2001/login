import React from "react";

function InputField(props) {
  const { label, id, extra, placeholder, type, value, onChange, disabled } = props;

  return (
    <div className={`${extra}`}>
      <label htmlFor={id} className="ml-3 mb-2 text-sm font-bold text-navy-700 dark:text-white">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value} // Bind value to the input field
        onChange={onChange} // Handle onChange event
        placeholder={placeholder}
        disabled={disabled}
        className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white"
      />
    </div>
  );
}

export default InputField;
