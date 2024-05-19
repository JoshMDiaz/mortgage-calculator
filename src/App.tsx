import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Container, Grid } from '@mui/material'
import ProfitCalculator from './routes/ProfitCalculator'
import styles from './App.module.scss'
import { formatNumberWithCommas } from './utils/formatNumber'

const App: React.FC = () => {
	const [profit, setProfit] = useState<number | null>(null)
	const [scrolled, setScrolled] = useState<boolean>(false)

	const getProfitColor = (profit: number | null) => {
		if (profit === null) return 'black'
		if (profit > 0) return 'green'
		if (profit < 0) return 'red'
		return 'black'
	}

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 0)
		}

		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<Container className={styles.container}>
			<AppBar
				position='sticky'
				style={{
					backgroundColor: 'white',
					borderBottom: '1px solid #ccc',
					boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
					transition: 'box-shadow 0.3s ease-in-out'
				}}
			>
				<Toolbar>
					<Grid container justifyContent='space-between' alignItems='center'>
						<Grid item>
							<Typography
								variant='h4'
								component='h1'
								style={{ color: 'black' }}
							>
								Profit Calculator
							</Typography>
						</Grid>
						<Grid item>
							{profit !== null && (
								<Typography
									variant='h5'
									style={{ color: getProfitColor(profit) }}
								>
									Profit: ${formatNumberWithCommas(profit.toFixed(2))}
								</Typography>
							)}
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<div style={{ marginTop: '16px' }}>
				<ProfitCalculator setProfit={setProfit} />
			</div>
		</Container>
	)
}

export default App
