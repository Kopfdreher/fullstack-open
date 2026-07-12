import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => {
	return (
		<tr>
			<td>{text}</td>
			<td>{value}</td>
		</tr>
	)
}

const Statistics = ({ good, neutral, bad }) => {
	const all = good + neutral + bad;

	if (!all)
		return (
			<>
				<h1>statistics</h1>
				<p>No feedback given!</p>
			</>
		)
	return (
		<>
			<h1>statistics</h1>
			<table>
				<tbody>
					<StatisticLine text="good" value={good} />
					<StatisticLine text="neutral" value={neutral} />
					<StatisticLine text="bad" value={bad} />
					<StatisticLine text="all" value={all} />
					<StatisticLine text="average" value={(good - bad) / all} />
					<StatisticLine text="positive" value={100 * good / all} />
				</tbody>
			</table>
		</>
	)
}

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const handleGood = () => setGood(good + 1)
	const handleNeutral = () => setNeutral(neutral + 1)
	const handleBad = () => setBad(bad + 1)

	return (
		<div>
			<h1>give feedback</h1>
			<Button onClick={handleGood} text='good' />
			<Button onClick={handleNeutral} text='neutral' />
			<Button onClick={handleBad} text='bad' />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

export default App
