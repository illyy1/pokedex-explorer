import { useState } from 'react'
import { usePokemonData } from '../pokemonData'
import { SHOWDOWN_TEAMBUILDER_URL, teamToShowdownText } from '../showdown'
import type { Team } from '../teams'

type Props = {
  team: Team
}

// Copies a team in Pokémon Showdown's text format and opens Showdown's team
// builder in a new tab, where it can be pasted with "Import from text".
// Showdown has no link that adds a team for you, so pasting is the last step.
function ShowdownExport({ team }: Props) {
  const { index, isLoadingIndex } = usePokemonData()
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  const nameOf = (id: number) => index.find((p) => p.id === id)?.name ?? String(id)
  const text = teamToShowdownText(team, nameOf)
  const isEmpty = team.members.length === 0

  function handleExport() {
    // Start copying before the new tab takes the focus away from this page.
    const copying = navigator.clipboard
      ? navigator.clipboard.writeText(text)
      : Promise.reject(new Error('No clipboard'))
    copying.then(
      () => setStatus('copied'),
      () => setStatus('failed'),
    )
    window.open(SHOWDOWN_TEAMBUILDER_URL, '_blank', 'noopener')
  }

  return (
    <div className="showdown-export">
      <button
        type="button"
        className="button showdown-button"
        onClick={handleExport}
        disabled={isEmpty || isLoadingIndex}
      >
        Export to Showdown
      </button>
      {isEmpty && <p className="showdown-help">Add a Pokémon to export this team.</p>}
      {status === 'copied' && (
        <p className="showdown-help" role="status">
          Team copied! In Showdown, click <strong>New Team</strong>, then{' '}
          <strong>Import from text</strong>, paste it, and click <strong>Save</strong>. Pick a
          Gen 5 format to battle with it. Items, natures and EVs aren't in our team builder, so
          add those in Showdown.
        </p>
      )}
      {status === 'failed' && (
        <div className="showdown-help" role="status">
          <p>
            Your browser didn't allow copying. Select the text below, copy it, and paste it into
            Showdown with <strong>New Team</strong> → <strong>Import from text</strong>.
          </p>
          <textarea
            readOnly
            value={text}
            rows={Math.min(text.split('\n').length + 1, 18)}
            aria-label="Team in Showdown's format"
            onFocus={(event) => event.target.select()}
          />
        </div>
      )}
    </div>
  )
}

export default ShowdownExport
