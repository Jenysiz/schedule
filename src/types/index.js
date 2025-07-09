// Type definitions for reference (converted to JSDoc comments)

/**
 * @typedef {Object} Facility
 * @property {string} id
 * @property {string} name
 * @property {string} department
 * @property {number} capacity
 * @property {'kitchen' | 'service' | 'admin' | 'bar'} type
 */

/**
 * @typedef {Object} Employee
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} [avatar]
 * @property {string} department
 */

/**
 * @typedef {Object} ShiftAssignment
 * @property {string} id
 * @property {string} facilityId
 * @property {string} employeeId
 * @property {string} date
 * @property {'morning' | 'evening'} shift
 * @property {string} startTime
 * @property {string} endTime
 */

/**
 * @typedef {Object} ShiftSchedule
 * @property {Object.<string, Object.<string, {morning?: string, evening?: string}>>} schedule
 */

export {};