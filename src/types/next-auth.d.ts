import 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      companyId: string;
      companyName: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    companyId: string;
    companyName: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    companyId: string;
    companyName: string;
  }
}
