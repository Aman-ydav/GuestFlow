const FIRST_NAMES = ['Lalita', 'Arun', 'Priya', 'Vikram', 'Sneha', 'Rohan', 'Kavya', 'Aditya', 'Meera', 'Karan', 'Divya', 'Sanjay']
const LAST_NAMES = ['Mehta', 'Kumar', 'Sharma', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Gupta', 'Singh', 'Rao', 'Joshi', 'Verma']
const DEPARTMENTS = ['Engineering', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Marketing', 'Security']

let counter = 0

/** One host (employee) record. Pure function of an optional seed index for reproducibility. */
export function makeHost(index = counter++) {
  const first = FIRST_NAMES[index % FIRST_NAMES.length]
  const last = LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length]
  const name = `${first} ${last}`
  return {
    id: `host-${index}`,
    name,
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    email: `${first.toLowerCase()}.${last.toLowerCase()}@guestflow.dev`,
  }
}
