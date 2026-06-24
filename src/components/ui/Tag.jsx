export default function Tag({ type, children }) {
  return <span className={`tag tag-${type}`}>{children}</span>
}
