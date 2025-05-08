import { User } from './user.model'; // Import User model

export interface Supplier {
  id: number;
  name: string;
  contactInfo: string;
  email: string;
  userId: number; // Keep userId for the form, but the received object will have 'user'
  user?: User; // Add the user property (optional as it might not always be populated)
}
