// Use in .mdx posts:  <Callout title="Heads up">text</Callout>
export default function Callout({ title, children }) {
  return (
    <aside className="callout">
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </aside>
  );
}
