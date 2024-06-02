import React, { useState, useEffect, useRef } from 'react'
import {
	Typography,
	Container,
	TextField,
	Button,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Modal,
	Box
} from '@mui/material'
import {
	formatNumberWithCommas,
	parseFormattedNumber
} from '../utils/formatNumber'
import { setCaretPosition } from '../utils/caretUtils'
import InputWithIcon from '../components/InputWithIcon'
import styles from '../App.module.scss'

interface DynamicField {
	id: number
	label: string
	value: string
	type: 'dollar' | 'percent'
}

interface ProfitCalculatorProps {
	setProfit: (profit: number | null) => void
}

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ setProfit }) => {
	const [salePrice, setSalePrice] = useState<string>('')
	const [commissionPct, setCommissionPct] = useState<string>('')
	const [sellerConcessions, setSellerConcessions] = useState<string>('')
	const [sellerConcessionsType, setSellerConcessionsType] = useState<
		'dollar' | 'percent'
	>('dollar')
	const [currentMortgageLoan, setCurrentMortgageLoan] = useState<string>('')
	const [closingCosts, setClosingCosts] = useState<string>('')
	const [closingCostsType, setClosingCostsType] = useState<
		'dollar' | 'percent'
	>('dollar')
	const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([])
	const [error, setError] = useState<string | null>(null)
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [newFieldLabel, setNewFieldLabel] = useState<string>('')
	const [newFieldType, setNewFieldType] = useState<'dollar' | 'percent'>(
		'dollar'
	)
	const newFieldLabelRef = useRef<HTMLInputElement>(null)

	// Load data from localStorage on component mount
	useEffect(() => {
		const savedSalePrice = localStorage.getItem('salePrice')
		const savedCommissionPct = localStorage.getItem('commissionPct')
		const savedSellerConcessions = localStorage.getItem('sellerConcessions')
		const savedSellerConcessionsType = localStorage.getItem(
			'sellerConcessionsType'
		)
		const savedCurrentMortgageLoan = localStorage.getItem('currentMortgageLoan')
		const savedClosingCosts = localStorage.getItem('closingCosts')
		const savedClosingCostsType = localStorage.getItem('closingCostsType')
		const savedDynamicFields = localStorage.getItem('dynamicFields')

		if (savedSalePrice) setSalePrice(savedSalePrice)
		if (savedCommissionPct) setCommissionPct(savedCommissionPct)
		if (savedSellerConcessions) setSellerConcessions(savedSellerConcessions)
		if (savedSellerConcessionsType)
			setSellerConcessionsType(
				savedSellerConcessionsType as 'dollar' | 'percent'
			)
		if (savedCurrentMortgageLoan)
			setCurrentMortgageLoan(savedCurrentMortgageLoan)
		if (savedClosingCosts) setClosingCosts(savedClosingCosts)
		if (savedClosingCostsType)
			setClosingCostsType(savedClosingCostsType as 'dollar' | 'percent')
		if (savedDynamicFields) setDynamicFields(JSON.parse(savedDynamicFields))
	}, [])

	// Save data to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('salePrice', salePrice)
	}, [salePrice])

	useEffect(() => {
		localStorage.setItem('commissionPct', commissionPct)
	}, [commissionPct])

	useEffect(() => {
		localStorage.setItem('sellerConcessions', sellerConcessions)
	}, [sellerConcessions])

	useEffect(() => {
		localStorage.setItem('sellerConcessionsType', sellerConcessionsType)
	}, [sellerConcessionsType])

	useEffect(() => {
		localStorage.setItem('currentMortgageLoan', currentMortgageLoan)
	}, [currentMortgageLoan])

	useEffect(() => {
		localStorage.setItem('closingCosts', closingCosts)
	}, [closingCosts])

	useEffect(() => {
		localStorage.setItem('closingCostsType', closingCostsType)
	}, [closingCostsType])

	useEffect(() => {
		localStorage.setItem('dynamicFields', JSON.stringify(dynamicFields))
	}, [dynamicFields])

	// Calculate profit whenever any input changes
	useEffect(() => {
		calculateProfit()
	}, [
		salePrice,
		commissionPct,
		sellerConcessions,
		sellerConcessionsType,
		currentMortgageLoan,
		closingCosts,
		closingCostsType,
		dynamicFields
	])

	// Auto-focus the first input in the modal when it opens
	useEffect(() => {
		if (modalOpen && newFieldLabelRef.current) {
			newFieldLabelRef.current.focus()
		}
	}, [modalOpen])

	const handleInputChange =
		(setter: React.Dispatch<React.SetStateAction<string>>) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const input = e.target
			const value = input.value
			const caretPosition = input.selectionStart

			if (value === '') {
				setter('')
			} else {
				const parsedValue = parseFormattedNumber(value)
				const formattedValue = formatNumberWithCommas(parsedValue)
				setter(formattedValue)

				// Set the caret position after formatting
				setTimeout(() => {
					if (caretPosition !== null) {
						const newCaretPosition =
							caretPosition + (formattedValue.length - value.length)
						setCaretPosition(input, newCaretPosition)
					}
				}, 0)
			}
		}

	const handleDynamicFieldChange = (
		id: number,
		key: keyof DynamicField,
		value: string | 'dollar' | 'percent'
	) => {
		setDynamicFields((prevFields) =>
			prevFields.map((field) =>
				field.id === id ? { ...field, [key]: value } : field
			)
		)
	}

	const addDynamicField = () => {
		setModalOpen(true)
	}

	const handleModalClose = () => {
		setModalOpen(false)
		setNewFieldLabel('')
		setNewFieldType('dollar')
	}

	const handleModalSubmit = () => {
		setDynamicFields((prevFields) => [
			...prevFields,
			{ id: Date.now(), label: newFieldLabel, value: '', type: newFieldType }
		])
		handleModalClose()
	}

	const removeDynamicField = (id: number) => {
		setDynamicFields((prevFields) =>
			prevFields.filter((field) => field.id !== id)
		)
	}

	const calculateProfit = () => {
		if (!salePrice || !commissionPct || !currentMortgageLoan || !closingCosts) {
			setError('Please fill in all required fields.')
			return
		}

		const salePriceNum = parseFormattedNumber(salePrice)
		const commissionPctNum = parseFloat(commissionPct) / 100
		const currentMortgageLoanNum = parseFormattedNumber(currentMortgageLoan)

		const sellerConcessionsNum =
			sellerConcessionsType === 'dollar'
				? parseFormattedNumber(sellerConcessions)
				: salePriceNum * (parseFloat(sellerConcessions) / 100)

		const closingCostsNum =
			closingCostsType === 'dollar'
				? parseFormattedNumber(closingCosts)
				: salePriceNum * (parseFloat(closingCosts) / 100)

		const dynamicFieldsTotal = dynamicFields.reduce((total, field) => {
			const fieldValue =
				field.type === 'dollar'
					? parseFormattedNumber(field.value)
					: salePriceNum * (parseFloat(field.value) / 100)
			return total + fieldValue
		}, 0)

		// Calculate the adjusted sale price after seller concessions
		const adjustedSalePrice = salePriceNum - sellerConcessionsNum

		// Calculate the commission based on the adjusted sale price
		const commissionAmount = adjustedSalePrice * commissionPctNum

		const profit =
			adjustedSalePrice -
			currentMortgageLoanNum -
			commissionAmount -
			closingCostsNum -
			dynamicFieldsTotal
		setProfit(profit)
		setError(null)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			calculateProfit()
		}
	}

	const handleModalKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleModalSubmit()
		}
	}

	return (
		<Container>
			<Grid container spacing={3} onKeyDown={handleKeyDown}>
				<Grid item xs={12} md={6}>
					<Typography variant='h6' component='h3' gutterBottom>
						Required Fields
					</Typography>
					<TextField
						label='Sale Price ($)'
						variant='outlined'
						fullWidth
						value={salePrice}
						onChange={handleInputChange(setSalePrice)}
						required
						style={{ marginBottom: '16px' }}
					/>
					<TextField
						label='Sales Commission (%)'
						variant='outlined'
						fullWidth
						value={commissionPct}
						onChange={(e) => setCommissionPct(e.target.value)}
						required
						style={{ marginBottom: '16px' }}
					/>
					<TextField
						label='Current Mortgage Loan Remaining ($)'
						variant='outlined'
						fullWidth
						value={currentMortgageLoan}
						onChange={handleInputChange(setCurrentMortgageLoan)}
						required
						style={{ marginBottom: '16px' }}
					/>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Grid container spacing={1}>
								<Grid item xs={12} sm={6}>
									<FormControl
										fullWidth
										variant='outlined'
										style={{ marginBottom: '16px' }}
									>
										<InputLabel>Closing Costs</InputLabel>
										<Select
											value={closingCostsType}
											onChange={(e) =>
												setClosingCostsType(
													e.target.value as 'dollar' | 'percent'
												)
											}
											label='Closing Costs'
											required
										>
											<MenuItem value='dollar'>Dollar Amount</MenuItem>
											<MenuItem value='percent'>Percentage</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label={
											closingCostsType === 'dollar'
												? 'Closing Costs ($)'
												: 'Closing Costs (%)'
										}
										variant='outlined'
										fullWidth
										value={closingCosts}
										onChange={handleInputChange(setClosingCosts)}
										required
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={1}>
								<Grid item xs={12} sm={6}>
									<FormControl
										fullWidth
										variant='outlined'
										style={{ marginBottom: '16px' }}
									>
										<InputLabel>Seller Concessions</InputLabel>
										<Select
											value={sellerConcessionsType}
											onChange={(e) =>
												setSellerConcessionsType(
													e.target.value as 'dollar' | 'percent'
												)
											}
											label='Seller Concessions'
										>
											<MenuItem value='dollar'>Dollar Amount</MenuItem>
											<MenuItem value='percent'>Percentage</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label={
											sellerConcessionsType === 'dollar'
												? 'Seller Concessions ($)'
												: 'Seller Concessions (%)'
										}
										variant='outlined'
										fullWidth
										value={sellerConcessions}
										onChange={handleInputChange(setSellerConcessions)}
										style={{ marginBottom: '16px' }}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant='h6' component='h3' gutterBottom>
						Additional Fields
					</Typography>
					{dynamicFields.map((field) => (
						<InputWithIcon
							key={field.id}
							label={`${field.label} (${field.type === 'dollar' ? '$' : '%'})`}
							value={field.value}
							onChange={(e) =>
								handleDynamicFieldChange(
									field.id,
									'value',
									formatNumberWithCommas(parseFormattedNumber(e.target.value))
								)
							}
							onDelete={() => removeDynamicField(field.id)}
						/>
					))}
					<Button variant='contained' color='primary' onClick={addDynamicField}>
						Add Field
					</Button>
				</Grid>
			</Grid>

			<Modal
				open={modalOpen}
				onClose={handleModalClose}
				aria-labelledby='add-field-modal-title'
				aria-describedby='add-field-modal-description'
			>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24,
						p: 4
					}}
					onKeyDown={handleModalKeyDown}
				>
					<Typography id='add-field-modal-title' variant='h6' component='h2'>
						Add New Field
					</Typography>
					<TextField
						label='Label Name'
						variant='outlined'
						fullWidth
						value={newFieldLabel}
						onChange={(e) => setNewFieldLabel(e.target.value)}
						style={{ marginTop: '16px' }}
						inputRef={newFieldLabelRef}
						autoFocus
					/>
					<FormControl
						fullWidth
						variant='outlined'
						style={{ marginTop: '16px' }}
					>
						<InputLabel>Type</InputLabel>
						<Select
							value={newFieldType}
							onChange={(e) =>
								setNewFieldType(e.target.value as 'dollar' | 'percent')
							}
							label='Type'
						>
							<MenuItem value='dollar'>Dollar Amount</MenuItem>
							<MenuItem value='percent'>Percentage</MenuItem>
						</Select>
					</FormControl>
					<Button
						variant='contained'
						color='primary'
						onClick={handleModalSubmit}
						style={{ marginTop: '16px' }}
					>
						Add Field
					</Button>
				</Box>
			</Modal>
		</Container>
	)
}

export default ProfitCalculator
