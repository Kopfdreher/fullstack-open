const Header = ({ name }) => {
	return (
		<>
			<h1>{name}</h1>
		</>
	)
}

const Part = (props) => {
	return (
			<p>{props.parts.name} {props.parts.exercises}</p>
	)
}

const Content = (props) => {
	return (
		<>
      { props.parts.map( part =>
        <Part key={part.id} parts={part} />
      )}
		</>
	)
}

const Total = (props) => {
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
	return (
		<p>
      <strong>Number of exercises { total }</strong>
    </p>
	)
}

const Course = ({ course }) => {
	return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course
