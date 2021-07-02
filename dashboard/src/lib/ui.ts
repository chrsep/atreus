/** Combines multiple classnames into one */
export function tw(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
