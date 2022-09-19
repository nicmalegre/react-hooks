// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

// See if you can figure out how to store all of your state in a single object
// with a single React.useState call so I can update my state like this:
// setState({status: 'resolved', pokemon})

import * as React from 'react'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

const STATES = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
}

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    const {error} = this.state
    if (error) {
      return (
        <div role="alert">
          There was an error:
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: STATES.IDLE,
    pokemon: null,
    error: null,
  })

  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) return

    setState({status: STATES.PENDING})

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({status: STATES.RESOLVED, pokemon: pokemonData})
      })
      .catch(error => {
        setState({status: STATES.REJECTED, error})
      })
  }, [pokemonName])

  if (status === STATES.PENDING)
    return <PokemonInfoFallback name={pokemonName} />

  if (status === STATES.RESOLVED) return <PokemonDataView pokemon={pokemon} />

  if (status === STATES.REJECTED) throw error

  if (status === STATES.IDLE) return 'Submit a pokemon'
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
