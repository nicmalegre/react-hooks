// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

// Take your custom useLocalStorageState hook and make it generic enough to support any data type
// (remember, you have to serialize objects to strings... use JSON.stringify and JSON.parse).
// Go wild with this!

import * as React from 'react'

export const useLocalStorageState = (key, defaultValue) => {
  const [state, setState] = React.useState(
    () => JSON.parse(window.localStorage.getItem(key)) ?? defaultValue,
  )

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
