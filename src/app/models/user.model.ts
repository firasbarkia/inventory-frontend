export interface User {
  id: number;
  username: string;
  email?: string; // Added email based on requirements
  roles: string[]; // e.g., ['ADMIN', 'SUPPLIER', 'WORKER']
  status?: string; // Added status based on requirements (AccountStatus)
  password?: string; // Added password for creation/update form
  token: string; // Assuming a token is used for authentication
}
