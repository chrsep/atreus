/** Combines multiple classnames into one */
export function tw(...classes: Array<string | boolean>) {
  return classes.filter(Boolean).join(" ")
}
