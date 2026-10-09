import { useState } from 'react'
import { usePokemonData } from '../pokemonData'
import { SHOWDOWN_TEAMBUILDER_URL, teamToShowdownText } from '../showdown'
import type { Team } from '../teams'

type Props = {
  team: Team
}

// Characters that can't be in a file name on Windows, macOS or Linux.
const UNSAFE_IN_FILE_NAMES = /[<>:"/\\|?*]/g

// "Rain Team" -> "Rain Team.txt"; a name with nothing usable left becomes "team.txt".
function fileNameFor(teamName: string): string {
  const safe = [...teamName.replace(UNSAFE_IN_FILE_NAMES, '')]
    // Leave out invisible control characters too.
    .filter((char) => char.charCodeAt(0) >= 32)
    .join('')
    // "Rain: Team" -> "Rain Team", not "Rain  Team".
    .replace(/\s+/g, ' ')
    .trim()
  return `${safe || 'team'}.txt`
}

// Two ways to take a team out of the app, both in Pokémon Showdown's text
// format: "Export to Showdown" copies it and opens Showdown's team builder in
// a new tab, where it is pasted with "Import from text" (Showdown has no
// link that adds a team for you), and "Save as text file" downloads it as a
// .txt file to keep or import later.
function ShowdownExport({ team }: Props) {
  const { index, isLoadingIndex } = usePokemonData()
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed' | 'saved'>('idle')

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

  // Downloads the team as a text file named after the team.
  function handleSave() {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = fileNameFor(team.name)
    link.click()
    // Give the browser a moment to start the download before letting go of the file.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('saved')
  }

  return (
    <div className="showdown-export">
      <div className="showdown-actions">
        <button
          type="button"
          className="button showdown-button"
          onClick={handleExport}
          disabled={isEmpty || isLoadingIndex}
        >
          Export to Showdown
        </button>
        <button
          type="button"
          className="button showdown-button"
          onClick={handleSave}
          disabled={isEmpty || isLoadingIndex}
        >
          Save as text file
        </button>
      </div>
      {isEmpty && <p className="showdown-help">Add a Pokémon to export or save this team.</p>}
      {status === 'saved' && (
        <p className="showdown-help" role="status">
          Saved as <strong>{fileNameFor(team.name)}</strong> in your downloads. To use it in
          Showdown, open the file, copy everything, and paste it with <strong>New Team</strong> →{' '}
          <strong>Import from text</strong>.
        </p>
      )}
      {status === 'copied' && (
        <p className="showdown-help" role="status">
          Team copied! In Showdown, click <strong>New Team</strong>, then{' '}
          <strong>Import from text</strong>, paste it, and click <strong>Save</strong>. Pick a
          Gen 5 format to battle with it.
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
