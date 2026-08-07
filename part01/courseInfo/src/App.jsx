const Header = (props) => {
	return (
		<>
			<h1>{props.course}</h1>
		</>
	)
}

const Part = (props) => {
	return (
			<p>{props.parts.part} {props.parts.exercises}</p>
	)
}

const Content = (props) => {
	return (
		<>
			<Part parts={props.parts[0]} />
			<Part parts={props.parts[1]} />
			<Part parts={props.parts[2]} />
		</>
	)
}

const Total = (props) => {
	return (
		<p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
	)
}

const App = () => {
	const course = 'Half Stack application development'
	const parts = [
		{ part: "Fundamentals of React", exercises: 10 },
		{ part: "Using props to pass data", exercises: 7 },
		{ part: "State of a component", exercises: 14 },
	];

	return (
		<div>
			<Header course={course}/>
			<Content parts={parts}/>
			<Total parts={parts}/>
		</div>
	)
}

export default App
