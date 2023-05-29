import { UserRoles, UserRolesLabel } from './types/users';
export const apiUrl = 'http://localhost:5050';
export const proxyUrl = 'http://localhost:3000/api';

export const ageRestrictions = [
  { value: '0', label: '--' },
  { value: '6', label: '6+' },
  { value: '12', label: '12+' },
  { value: '16', label: '16+' },
  { value: '18', label: '18+' },
  { value: '21', label: '21+' },
];

export const rolesOptions = [
  { value: 'user', label: 'User' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
];

export const rolesMapping: { [key in UserRoles]: string } = {
  user: 'User',
  manager: 'Manager',
  admin: 'Admin',
};

export const userRoles: {[key in UserRolesLabel]: UserRoles} = {
  MANAGER: 'manager',
  USER: 'user',
  ADMIN: 'admin',
};
