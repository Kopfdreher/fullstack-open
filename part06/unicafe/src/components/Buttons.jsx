import { useStatControls } from './stats'

const Buttons = () => {
  const { addGood, addNeutral, addBad } = useStatControls()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={addGood}>good</button>
      <button onClick={addNeutral}>neutral</button>
      <button onClick={addBad}>bad</button>
    </div>
  )
}

export default Buttons
