/**
 * Small, composable field validators. Each returns an error string or null.
 * Forms call `validate(values, rules)` once and render `errors[field]`.
 */
export const required = (label) => (value) =>
  value === undefined || value === null || String(value).trim() === '' ? `${label} is required` : null

export const minLength = (n, label) => (value) =>
  value && value.trim().length < n ? `${label} must be at least ${n} characters` : null

export const isEmail = (value) =>
  value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address' : null

export const isPhone = (value) =>
  value && !/^\d{10}$/.test(value.replace(/\D/g, '')) ? 'Enter a valid 10-digit phone number' : null

export function composeValidators(...validators) {
  return (value, allValues) => {
    for (const v of validators) {
      const error = v.length > 1 ? v(value, allValues) : v(value)
      if (error) return error
    }
    return null
  }
}

/**
 * @param {object} values
 * @param {object} rules - { fieldName: (value, allValues) => string | null }
 * @returns {object} errors - only keys with a truthy error message
 */
export function validate(values, rules) {
  const errors = {}
  for (const [field, rule] of Object.entries(rules)) {
    const error = rule(values[field], values)
    if (error) errors[field] = error
  }
  return errors
}
