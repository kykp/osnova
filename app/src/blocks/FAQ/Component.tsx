import React from 'react'

type Item = { id?: string | null; question: string; answer: string }

type FAQProps = {
  heading?: string | null
  items?: Item[] | null
}

const PlusIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  </span>
)

export function FAQ({ heading, items }: FAQProps) {
  const list = items ?? []
  if (list.length === 0) return null

  return (
    <section className="section" id="faq">
      <div className="container">
        {heading && (
          <div className="section-head center reveal">
            <span className="eyebrow center">Частые вопросы</span>
            <h2>{heading}</h2>
          </div>
        )}
        <div className="faq reveal">
          {list.map((it, i) => (
            <details key={it.id ?? i} className="qa" open={i === 0}>
              <summary className="qa-q">
                <h3>{it.question}</h3>
                <span className="pm">
                  <PlusIcon />
                </span>
              </summary>
              <div className="qa-a">
                <div className="qa-a-in">{it.answer}</div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
