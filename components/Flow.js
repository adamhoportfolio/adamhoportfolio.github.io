import { Fragment } from "react";

// A top-to-bottom flow diagram in plain HTML, so it stays sharp at any width and
// every box can link to the section that explains it. Use in .mdx posts:
//   <Flow caption="..." rows='[[{ "label": "API", "sub": "httpx", "href": "#pipeline", "step": 1 }], ...]' />
// `rows` is a JSON string: next-mdx-remote blocks JavaScript expressions in MDX props.
// Each row is a list of boxes side by side, each with an arrow into it from the row
// above. {"spacer": true} keeps a column empty, so a box can sit under one branch.
// A box's `via` labels the arrow coming into it (e.g. "yes" / "no").
export default function Flow({ rows: json, caption }) {
  const rows = typeof json === "string" ? JSON.parse(json) : json;
  return (
    <figure className="flow">
      {rows.map((row, r) => (
        <Fragment key={r}>
          {r > 0 ? (
            <div className="flow-row" aria-hidden="true">
              {row.map((box, b) => <div key={b} className="flow-arrow">{box.spacer ? "" : "↓"}</div>)}
            </div>
          ) : null}
          <div className="flow-row">
            {row.map((box, b) => {
              if (box.spacer) return <div key={b} className="flow-spacer" />;
              const body = (
                <>
                  {box.via ? <span className="flow-via">{box.via}</span> : null}
                  {box.step ? <span className="phase-num">{box.step}</span> : null}
                  <span className="flow-label">{box.label}</span>
                  {box.sub ? <span className="flow-sub">{box.sub}</span> : null}
                </>
              );
              return box.href
                ? <a key={b} className="flow-box" href={box.href}>{body}</a>
                : <div key={b} className="flow-box">{body}</div>;
            })}
          </div>
        </Fragment>
      ))}
      {caption ? <figcaption className="caption">{caption}</figcaption> : null}
    </figure>
  );
}
