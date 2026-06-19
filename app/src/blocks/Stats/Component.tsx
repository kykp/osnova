import React from 'react'

type Item = { id?: string | null; value: string; label: string }

type StatsProps = {
  heading?: string | null
  subheading?: string | null
  items?: Item[] | null
}

function splitValue(value: string): { main: string; suffix: string | null } {
  const m = value.match(/^([\d.,\s]+)([^\d.,\s].*)?$/)
  if (m && m[2]) return { main: m[1], suffix: m[2] }
  return { main: value, suffix: null }
}

export function Stats({ heading, subheading, items }: StatsProps) {
  const list = items ?? []
  if (list.length === 0) return null

  return (
    <section className="section tight" id="stats">
      <div className="container">
        {(heading || subheading) && (
          <div className="section-head center reveal">
            <span className="eyebrow center">В цифрах</span>
            {heading && <h2>{heading}</h2>}
            {subheading && <p className="sub">{subheading}</p>}
          </div>
        )}
        <div className="stats reveal">
          {list.map((it, i) => {
            const { main, suffix } = splitValue(it.value)
            return (
              <div key={it.id ?? i} className="stat">
                <div className="v">
                  {main}
                  {suffix && <small>{suffix}</small>}
                </div>
                <div className="k">{it.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
