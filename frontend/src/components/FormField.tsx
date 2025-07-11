import { FormFieldProps } from '@/types/form'
import React from 'react'

export const FormField: React.FC<FormFieldProps> = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  disabled,
}) => (
  <div className="form-group">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required
    />
  </div>
)
