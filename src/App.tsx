import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Container } from '@mui/material'
import ProfitCalculator from './routes/ProfitCalculator'
import PaymentCalculator from './routes/PaymentCalculator'
import styles from './App.module.scss'

const App: React.FC = () => {
	return (
		<Router>
			<AppBar position='static'>
				<Toolbar>
					<Button color='inherit' component={Link} to='/'>
						Profit Calculator
					</Button>
					<Button color='inherit' component={Link} to='/payment-calculator'>
						Payment Calculator
					</Button>
				</Toolbar>
			</AppBar>
			<Container className={styles.container}>
				<Routes>
					<Route path='/' element={<ProfitCalculator />} />
					<Route path='/payment-calculator' element={<PaymentCalculator />} />
				</Routes>
			</Container>
		</Router>
	)
}

export default App
