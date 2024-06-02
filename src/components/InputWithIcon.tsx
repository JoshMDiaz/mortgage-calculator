import React from 'react'
import { TextField, IconButton, InputAdornment, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface InputWithIconProps {
	label: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onDelete: () => void
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
	label,
	value,
	onChange,
	onDelete
}) => {
	return (
		<Box mb={2}>
			<TextField
				label={label}
				variant='outlined'
				fullWidth
				value={value}
				onChange={onChange}
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<IconButton onClick={onDelete} edge='end'>
								<DeleteIcon />
							</IconButton>
						</InputAdornment>
					)
				}}
			/>
		</Box>
	)
}

export default InputWithIcon
