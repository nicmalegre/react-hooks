// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

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

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState(STATES.IDLE)

  React.useEffect(() => {
    if (!pokemonName) return

    setStatus(STATES.PENDING)
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemon(pokemonData)
        setStatus(STATES.RESOLVED)
      })
      .catch(error => {
        setError(error)
        setStatus(STATES.REJECTED)
      })
  }, [pokemonName])

  if (status === STATES.PENDING)
    return <PokemonInfoFallback name={pokemonName} />

  if (status === STATES.RESOLVED) return <PokemonDataView pokemon={pokemon} />

  if (status === STATES.REJECTED)
    return (
      <div role="alert">
        There was an error:
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )

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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
