import { useState } from 'react'

const getRandomInt = (max) => Math.floor(Math.random() * max)

const MostVoted = ({ anecdote, votes }) => {
	if (votes <= 0) return <></>
	return (
		<div>
			<h1>Anecdote with most votes</h1>
			<p>{anecdote}</p>
			<p>has {votes} votes</p>
		</div>
	)
}

const App = () => {
	const anecdotes = [
		'If it hurts, do it more often.',
		'Adding manpower to a late software project makes it later!',
		'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
		'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
		'Premature optimization is the root of all evil.',
		'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
		'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
		'The only way to go fast, is to go well.'
	]

	const [selected, setSelected] = useState(getRandomInt(anecdotes.length))
	const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

	const handleSelected = () => {
		let mostVoted
		do {
			mostVoted = getRandomInt(anecdotes.length)
		} while (mostVoted === selected)
		setSelected(mostVoted)
	}

	const handleVote = () => {
		const copy = [...votes]
		copy[selected]++
		setVotes(copy)
	}

	const getMostVoted = () => {
		let indexMax = 0
		for (let i = 1; i < anecdotes.length; i++) {
			if (votes[i] > votes[indexMax]) {
				indexMax = i
			}
		}
		return indexMax
	}

  return (
    <div>
			<h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
			<p>has {votes[selected]} votes</p>
			<button onClick={handleVote}>vote</button>
			<button onClick={handleSelected}>next anecdote</button>
			<MostVoted anecdote={anecdotes[getMostVoted()]} votes={votes[getMostVoted()]} />
    </div>
  )
}

export default App
