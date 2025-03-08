// src/components/forms/SelectedInput.tsx
import React from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectProps,
} from '@mui/material'

interface CustomSelectProps extends Omit<SelectProps, 'onChange'> {
  label: string
  options: { value: string; label: string }[]
  onChange?: SelectProps['onChange']
}

const SelectInput: React.FC<CustomSelectProps> = ({
  label,
  options,
  ...rest
}) => {
  return (
    <FormControl fullWidth variant="outlined" className="my-2">
      <InputLabel>{label}</InputLabel>
      <Select label={label} {...rest}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectInput
