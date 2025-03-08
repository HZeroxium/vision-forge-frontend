// src/utils/debounce.ts
export function debounce<F extends (...args: unknown[]) => void>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
