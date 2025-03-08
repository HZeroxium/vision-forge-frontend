import React from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectProps,
} from '@mui/material'

interface CustomSelectProps extends SelectProps {
  label: string
  options: { value: string; label: string }[]
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
