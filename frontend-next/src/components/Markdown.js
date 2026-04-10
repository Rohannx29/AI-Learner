function renderInline(text) {
  const parts = []
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let last = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))

    const token = match[0]
    if (token.startsWith("**"))
      parts.push(<strong key={match.index} className="font-semibold text-white">{token.slice(2, -2)}</strong>)
    else if (token.startsWith("*"))
      parts.push(<em key={match.index} className="italic">{token.slice(1, -1)}</em>)
    else if (token.startsWith("`"))
      parts.push(<code key={match.index} className="px-1.5 py-0.5 rounded bg-[#334155] text-cyan-300 text-xs font-mono">{token.slice(1, -1)}</code>)

    last = match.index + token.length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts.length ? parts : text
}

export default function Markdown({ content }) {
  if (!content) return null

  const lines = content.split("\n")
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i]))
        items.push(lines[i++].replace(/^\d+\.\s/, ""))
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-2 ml-2">
          {items.map((item, j) => <li key={j} className="leading-relaxed">{renderInline(item)}</li>)}
        </ol>
      )
      continue
    }

    if (/^[-*•]\s/.test(line)) {
      const items = []
      while (i < lines.length && /^[-*•]\s/.test(lines[i]))
        items.push(lines[i++].replace(/^[-*•]\s/, ""))
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-2 ml-2">
          {items.map((item, j) => <li key={j} className="leading-relaxed">{renderInline(item)}</li>)}
        </ul>
      )
      continue
    }

    if (line.trim() === "") {
      elements.push(<div key={`br-${i}`} className="h-2" />)
      i++
      continue
    }

    elements.push(
      <p key={`p-${i}`} className="leading-relaxed">{renderInline(line)}</p>
    )
    i++
  }

  return <div className="space-y-1 text-sm">{elements}</div>
}