import React from 'react'

type Step = {
  id?: string | null
  title: string
  description?: string | null
  icon?: string | null
}

type ProcessProps = {
  heading?: string | null
  subheading?: string | null
  variant: 'horizontal' | 'vertical'
  steps?: Step[] | null
}

export function Process({ heading, subheading, variant, steps }: ProcessProps) {
  const list = steps ?? []
  if (list.length === 0) return null

  const isVertical = variant === 'vertical'

  return (
    <section className="section" id="process">
      <div className="container">
        {(heading || subheading) && (
          <div className="section-head center reveal">
            <span className="eyebrow center">Этапы</span>
            {heading && <h2>{heading}</h2>}
            {subheading && <p className="sub">{subheading}</p>}
          </div>
        )}
        <div className={`steps reveal${isVertical ? ' is-vertical' : ''}`}>
          {list.map((s, i) => (
            <div key={s.id ?? i} className="step">
              <div className="node">
                <span className="num">
                  {s.icon ? <span style={{ fontSize: 22 }}>{s.icon}</span> : <span>{i + 1}</span>}
                </span>
                {i < list.length - 1 && <span className="line" />}
              </div>
              <div className="step-body">
                <h3>{s.title}</h3>
                {s.description && <p>{s.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
