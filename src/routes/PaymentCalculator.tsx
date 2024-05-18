import React, { useState } from 'react'
import { Typography, Container, TextField, Button, Grid } from '@mui/material'

const PaymentCalculator: React.FC = () => {
	const [principal, setPrincipal] = useState<number | string>('')
	const [interestRate, setInterestRate] = useState<number | string>('')
	const [years, setYears] = useState<number | string>('')
	const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)

	const calculatePayment = () => {
		const principalNum = parseFloat(principal as string)
		const interestRateNum = parseFloat(interestRate as string) / 100 / 12
		const numberOfPayments = parseFloat(years as string) * 12

		const payment =
			(principalNum * interestRateNum) /
			(1 - Math.pow(1 + interestRateNum, -numberOfPayments))
		setMonthlyPayment(payment)
	}

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				Mortgage Payment Calculator
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<TextField
						label='Principal ($)'
						variant='outlined'
						fullWidth
						value={principal}
						onChange={(e) => setPrincipal(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label='Annual Interest Rate (%)'
						variant='outlined'
						fullWidth
						value={interestRate}
						onChange={(e) => setInterestRate(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label='Loan Term (years)'
						variant='outlined'
						fullWidth
						value={years}
						onChange={(e) => setYears(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12}>
					<Button
						variant='contained'
						color='primary'
						onClick={calculatePayment}
					>
						Calculate
					</Button>
				</Grid>
				{monthlyPayment !== null && (
					<Grid item xs={12}>
						<Typography variant='h5'>
							Monthly Payment: ${monthlyPayment.toFixed(2)}
						</Typography>
					</Grid>
				)}
			</Grid>
		</Container>
	)
}

export default PaymentCalculator
