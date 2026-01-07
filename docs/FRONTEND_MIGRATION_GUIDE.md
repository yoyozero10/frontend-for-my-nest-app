# Frontend Migration Guide - Backend Security Updates

> **Version**: 1.0  
> **Date**: 2026-01-07  
> **Impact Level**: MEDIUM - Requires frontend code updates  
> **Estimated Migration Time**: 6-11 hours

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Breaking Changes](#breaking-changes)
3. [API Response Changes](#api-response-changes)
4. [Migration Steps](#migration-steps)
5. [Code Examples](#code-examples)
6. [Testing Checklist](#testing-checklist)
7. [FAQ](#faq)

---

## Overview

### What Changed?

Backend đã implement **Response DTO pattern** để fix 2 lỗ hổng bảo mật CRITICAL:
- ✅ Password hash không còn bị expose
- ✅ RefreshToken không còn bị expose
- ✅ Permissions array đã bị remove khỏi responses
- ✅ Internal audit fields đã bị remove

### Why This Matters?

**Security**: Sensitive data không còn leak ra client  
**Impact**: Frontend cần update code để adapt với response structure mới

---

## Breaking Changes

### 🔴 CRITICAL: Permissions Array Removed

**Affected Endpoints**:
- `POST /api/auth/login`
- `GET /api/auth/refresh`
- `GET /api/auth/account`

**Before**:
```json
{
  "user": {
    "_id": "123",
    "name": "Admin",
    "email": "admin@gmail.com",
    "role": {
      "_id": "456",
      "name": "SUPER_ADMIN",
      "permissions": [  // ❌ REMOVED
        { "_id": "...", "name": "CREATE_USER", "apiPath": "/api/users", "method": "POST" },
        { "_id": "...", "name": "UPDATE_USER", "apiPath": "/api/users", "method": "PATCH" }
      ]
    },
    "permissions": [ ... ]  // ❌ REMOVED (duplicate)
  }
}
```

**After**:
```json
{
  "user": {
    "_id": "123",
    "name": "Admin",
    "email": "admin@gmail.com",
    "role": {
      "_id": "456",
      "name": "SUPER_ADMIN"
      // ✅ Only _id and name
    }
  }
}
```

---

### 🟡 MEDIUM: Role Object Simplified

**Affected Endpoints**:
- `GET /api/users`
- `GET /api/users/:id`

**Before**:
```json
{
  "role": {
    "_id": "456",
    "name": "SUPER_ADMIN",
    "description": "Super Administrator",  // ❌ REMOVED
    "isActive": true,  // ❌ REMOVED
    "permissions": [ ... ]  // ❌ REMOVED
  }
}
```

**After**:
```json
{
  "role": {
    "_id": "456",
    "name": "SUPER_ADMIN"
  }
}
```

---

### 🟢 SAFE: Fields Removed (Should NOT Impact Frontend)

These fields should NEVER have been used by frontend:

- ❌ `password` - Password hash
- ❌ `refreshToken` - Refresh token (should only be in httpOnly cookie)
- ❌ `createdBy` - Internal audit field
- ❌ `updatedBy` - Internal audit field
- ❌ `deletedBy` - Internal audit field
- ❌ `isDeleted` - Soft delete flag
- ❌ `deletedAt` - Soft delete timestamp
- ❌ `__v` - Mongoose version key

**Action Required**: Search codebase for these fields and remove references.

---

## API Response Changes

### POST /api/auth/login

**Before**:
```typescript
interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    user: {
      _id: string;
      name: string;
      email: string;
      role: {
        _id: string;
        name: string;
        description: string;  // ❌ REMOVED
        permissions: Permission[];  // ❌ REMOVED
      };
      permissions: Permission[];  // ❌ REMOVED
    };
  };
}
```

**After**:
```typescript
interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    user: {
      _id: string;
      name: string;
      email: string;
      role: {
        _id: string;
        name: string;  // ✅ Only these 2 fields
      };
    };
  };
}
```

---

### GET /api/users

**Before**:
```typescript
interface UsersResponse {
  statusCode: number;
  message: string;
  data: {
    meta: { current: number; pageSize: number; pages: number; total: number };
    result: Array<{
      _id: string;
      email: string;
      name: string;
      password: string;  // ❌ REMOVED
      refreshToken: string;  // ❌ REMOVED
      role: {
        _id: string;
        name: string;
        permissions: Permission[];  // ❌ REMOVED
      };
      createdBy: { _id: string; email: string };  // ❌ REMOVED
      updatedBy: { _id: string; email: string };  // ❌ REMOVED
      createdAt: string;
      updatedAt: string;
    }>;
  };
}
```

**After**:
```typescript
interface UsersResponse {
  statusCode: number;
  message: string;
  data: {
    meta: { current: number; pageSize: number; pages: number; total: number };
    result: Array<{
      _id: string;
      email: string;
      name: string;
      age?: number;
      gender?: string;
      address?: string;
      company?: { _id: string; name: string };
      role?: { _id: string; name: string };  // ✅ Simplified
      createdAt: string;
      updatedAt: string;
    }>;
  };
}
```

---

### GET /api/users/:id

**Before**:
```typescript
interface UserDetailResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    email: string;
    name: string;
    role: {
      _id: string;
      name: string;
      permissions: Array<{  // ❌ REMOVED
        _id: string;
        name: string;
        apiPath: string;
        method: string;
        module: string;
      }>;
    };
  };
}
```

**After**:
```typescript
interface UserDetailResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    email: string;
    name: string;
    age?: number;
    gender?: string;
    address?: string;
    company?: { _id: string; name: string };
    role?: { _id: string; name: string };  // ✅ No permissions
    createdAt: string;
    updatedAt: string;
  };
}
```

---

## Migration Steps

### Step 1: Update TypeScript Interfaces

**File**: `src/types/api.types.ts` (or equivalent)

```typescript
// ✅ NEW: Simplified interfaces

export interface Role {
  _id: string;
  name: string;
  // ❌ REMOVED: description, permissions, isActive
}

export interface User {
  _id: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  address?: string;
  company?: {
    _id: string;
    name: string;
  };
  role?: Role;
  createdAt: string;
  updatedAt: string;
  // ❌ REMOVED: password, refreshToken, permissions, createdBy, updatedBy
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role?: Role;
  // ❌ REMOVED: permissions array
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    user: AuthUser;
  };
}
```

---

### Step 2: Replace Permission-Based Logic with Role-Based

#### Option A: Simple Role-Based Authorization (Recommended)

**Create constants file**:

```typescript
// src/constants/permissions.ts

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  HR: 'HR',
  USER: 'USER',
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];

// Define permissions by role
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    users: { create: true, read: true, update: true, delete: true },
    jobs: { create: true, read: true, update: true, delete: true },
    companies: { create: true, read: true, update: true, delete: true },
    resumes: { create: true, read: true, update: true, delete: true },
  },
  [ROLES.HR]: {
    users: { create: false, read: true, update: false, delete: false },
    jobs: { create: true, read: true, update: true, delete: true },
    companies: { create: true, read: true, update: true, delete: false },
    resumes: { create: false, read: true, update: true, delete: false },
  },
  [ROLES.USER]: {
    users: { create: false, read: false, update: false, delete: false },
    jobs: { create: false, read: true, update: false, delete: false },
    companies: { create: false, read: true, update: false, delete: false },
    resumes: { create: true, read: true, update: true, delete: true },
  },
} as const;
```

**Create permission helper**:

```typescript
// src/utils/permissions.ts

import { ROLE_PERMISSIONS, RoleName } from '@/constants/permissions';
import type { User } from '@/types/api.types';

export const can = (
  user: User | null,
  module: keyof typeof ROLE_PERMISSIONS.SUPER_ADMIN,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean => {
  if (!user?.role?.name) return false;
  
  const roleName = user.role.name as RoleName;
  const rolePermissions = ROLE_PERMISSIONS[roleName];
  
  if (!rolePermissions) return false;
  
  return rolePermissions[module]?.[action] ?? false;
};

// Convenience functions
export const canCreate = (user: User | null, module: string) => 
  can(user, module as any, 'create');

export const canRead = (user: User | null, module: string) => 
  can(user, module as any, 'read');

export const canUpdate = (user: User | null, module: string) => 
  can(user, module as any, 'update');

export const canDelete = (user: User | null, module: string) => 
  can(user, module as any, 'delete');

// Check if user has specific role
export const hasRole = (user: User | null, ...roles: RoleName[]): boolean => {
  if (!user?.role?.name) return false;
  return roles.includes(user.role.name as RoleName);
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => 
  hasRole(user, 'SUPER_ADMIN');

export const isHR = (user: User | null): boolean => 
  hasRole(user, 'HR');
```

---

### Step 3: Update Components

#### Before (Permission-based):

```tsx
// ❌ OLD CODE - Will break
import { useAuth } from '@/hooks/useAuth';

function UserManagement() {
  const { user } = useAuth();
  
  // ❌ This will be undefined
  const canCreateUser = user?.permissions?.some(
    p => p.name === 'CREATE_USER'
  );
  
  return (
    <div>
      {canCreateUser && <CreateUserButton />}
    </div>
  );
}
```

#### After (Role-based):

```tsx
// ✅ NEW CODE - Works with new API
import { useAuth } from '@/hooks/useAuth';
import { can } from '@/utils/permissions';

function UserManagement() {
  const { user } = useAuth();
  
  // ✅ Use role-based permission check
  const canCreateUser = can(user, 'users', 'create');
  
  return (
    <div>
      {canCreateUser && <CreateUserButton />}
    </div>
  );
}
```

---

### Step 4: Update Route Guards

#### Before:

```tsx
// ❌ OLD CODE
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

function ProtectedRoute({ children, requiredPermission }) {
  const { user } = useAuth();
  
  // ❌ This will fail
  const hasPermission = user?.permissions?.some(
    p => p.name === requiredPermission
  );
  
  if (!hasPermission) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}

// Usage
<ProtectedRoute requiredPermission="CREATE_USER">
  <CreateUserPage />
</ProtectedRoute>
```

#### After:

```tsx
// ✅ NEW CODE
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { can } from '@/utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

function ProtectedRoute({ children, module, action }: ProtectedRouteProps) {
  const { user } = useAuth();
  
  // ✅ Use role-based check
  const hasPermission = can(user, module as any, action);
  
  if (!hasPermission) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
}

// Usage
<ProtectedRoute module="users" action="create">
  <CreateUserPage />
</ProtectedRoute>
```

---

### Step 5: Update Context/Store

#### React Context Example:

```tsx
// ✅ NEW CODE - src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthUser } from '@/types/api.types';
import { can, hasRole } from '@/utils/permissions';

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  can: (module: string, action: string) => boolean;
  hasRole: (...roles: string[]) => boolean;
  isAdmin: boolean;
  isHR: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  
  const login = async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    const { access_token, user: userData } = response.data.data;
    
    // Store token
    localStorage.setItem('access_token', access_token);
    
    // Store user (NO permissions array)
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };
  
  const value = {
    user,
    login,
    logout,
    can: (module: string, action: string) => can(user, module as any, action as any),
    hasRole: (...roles: string[]) => hasRole(user, ...roles as any),
    isAdmin: hasRole(user, 'SUPER_ADMIN'),
    isHR: hasRole(user, 'HR'),
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

### Step 6: Update UI Components

#### Conditional Rendering:

```tsx
// ✅ NEW CODE
import { useAuth } from '@/contexts/AuthContext';

function UserListPage() {
  const { can, isAdmin } = useAuth();
  
  return (
    <div>
      <h1>Users</h1>
      
      {/* Show create button only if user can create */}
      {can('users', 'create') && (
        <Button onClick={handleCreate}>Create User</Button>
      )}
      
      {/* Show admin panel only for admins */}
      {isAdmin && (
        <AdminPanel />
      )}
      
      <UserTable />
    </div>
  );
}
```

#### Table Actions:

```tsx
// ✅ NEW CODE
import { useAuth } from '@/contexts/AuthContext';

function UserTableRow({ user }: { user: User }) {
  const { can } = useAuth();
  
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role?.name}</td>
      <td>
        {can('users', 'update') && (
          <Button onClick={() => handleEdit(user._id)}>Edit</Button>
        )}
        {can('users', 'delete') && (
          <Button onClick={() => handleDelete(user._id)}>Delete</Button>
        )}
      </td>
    </tr>
  );
}
```

---

## Code Examples

### Complete Migration Example

#### Before (Old Code):

```tsx
// ❌ OLD CODE - Will break after backend update
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  
  // ❌ This will be undefined
  const canCreateJob = user?.permissions?.some(p => p.name === 'CREATE_JOB');
  const canUpdateJob = user?.permissions?.some(p => p.name === 'UPDATE_JOB');
  const canDeleteJob = user?.permissions?.some(p => p.name === 'DELETE_JOB');
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    const response = await api.get('/jobs');
    setJobs(response.data.data.result);
  };
  
  return (
    <div>
      <h1>Jobs</h1>
      {canCreateJob && <CreateJobButton />}
      
      {jobs.map(job => (
        <JobCard 
          key={job._id} 
          job={job}
          canUpdate={canUpdateJob}
          canDelete={canDeleteJob}
        />
      ))}
    </div>
  );
}
```

#### After (New Code):

```tsx
// ✅ NEW CODE - Works with new API
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { can } from '@/utils/permissions';
import api from '@/services/api';

function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  
  // ✅ Use role-based permission checks
  const canCreateJob = can(user, 'jobs', 'create');
  const canUpdateJob = can(user, 'jobs', 'update');
  const canDeleteJob = can(user, 'jobs', 'delete');
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    const response = await api.get('/jobs');
    setJobs(response.data.data.result);
  };
  
  return (
    <div>
      <h1>Jobs</h1>
      {canCreateJob && <CreateJobButton />}
      
      {jobs.map(job => (
        <JobCard 
          key={job._id} 
          job={job}
          canUpdate={canUpdateJob}
          canDelete={canDeleteJob}
        />
      ))}
    </div>
  );
}
```

---

## Testing Checklist

### Manual Testing

- [ ] **Login Flow**
  - [ ] Login with SUPER_ADMIN account
  - [ ] Verify `user.role.name` is present
  - [ ] Verify `user.permissions` is undefined
  - [ ] Verify `user.password` is undefined
  - [ ] Verify `user.refreshToken` is undefined

- [ ] **User List Page**
  - [ ] Verify users display correctly
  - [ ] Verify role names display correctly
  - [ ] Verify no password/refreshToken in console logs
  - [ ] Verify create button shows for SUPER_ADMIN/HR
  - [ ] Verify create button hidden for USER role

- [ ] **Permission Checks**
  - [ ] Login as SUPER_ADMIN → All buttons visible
  - [ ] Login as HR → Limited buttons visible
  - [ ] Login as USER → Minimal buttons visible

- [ ] **Route Guards**
  - [ ] Try accessing /admin as USER → Redirect to unauthorized
  - [ ] Try accessing /jobs as USER → Success
  - [ ] Try accessing /users as HR → Success

### Automated Testing

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import UserListPage from '@/pages/UserListPage';

describe('UserListPage with new API', () => {
  it('should show create button for SUPER_ADMIN', () => {
    const mockUser = {
      _id: '123',
      name: 'Admin',
      email: 'admin@test.com',
      role: { _id: '456', name: 'SUPER_ADMIN' }
    };
    
    render(
      <AuthProvider initialUser={mockUser}>
        <UserListPage />
      </AuthProvider>
    );
    
    expect(screen.getByText('Create User')).toBeInTheDocument();
  });
  
  it('should hide create button for USER', () => {
    const mockUser = {
      _id: '123',
      name: 'User',
      email: 'user@test.com',
      role: { _id: '789', name: 'USER' }
    };
    
    render(
      <AuthProvider initialUser={mockUser}>
        <UserListPage />
      </AuthProvider>
    );
    
    expect(screen.queryByText('Create User')).not.toBeInTheDocument();
  });
});
```

---

## FAQ

### Q1: Tại sao permissions array bị remove?

**A**: Vì lý do bảo mật. Permissions array chứa thông tin về API structure (apiPath, method) mà attacker có thể dùng để plan attacks. Role-based authorization đủ cho hầu hết use cases.

---

### Q2: Nếu tôi thực sự cần permissions chi tiết thì sao?

**A**: Có 2 options:

**Option 1**: Dùng role-based với permission mapping (recommended)
```typescript
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  HR: ['CREATE_JOB', 'UPDATE_JOB', ...],
  USER: ['VIEW_JOBS', 'CREATE_RESUME']
};
```

**Option 2**: Request backend team tạo endpoint `/auth/permissions` riêng
```typescript
const permissions = await api.get('/auth/permissions');
// Returns sanitized permissions (without apiPath/method)
```

---

### Q3: Code cũ có break ngay lập tức không?

**A**: Có, nếu code dùng `user.permissions` hoặc `user.role.permissions`. Cần update ngay.

---

### Q4: Có cần update tất cả components cùng lúc không?

**A**: Không. Có thể migrate từng từng:

1. Update TypeScript interfaces
2. Create permission helpers
3. Update components từng cái một
4. Test thoroughly

---

### Q5: Làm sao để test migration trước khi deploy?

**A**: 

1. **Local testing**: Backend team đã deploy lên dev/staging
2. **Mock data**: Update mock data để match new structure
3. **TypeScript**: TypeScript sẽ catch nhiều lỗi compile-time
4. **Console warnings**: Check console for undefined errors

---

### Q6: Có document nào về role permissions không?

**A**: Có, xem file `ROLE_PERMISSIONS` constant hoặc hỏi backend team về:
- SUPER_ADMIN: Full access
- HR: Manage jobs, companies, view resumes
- USER: View jobs, manage own resumes

---

## Support

Nếu gặp vấn đề trong quá trình migration:

1. **Check TypeScript errors** - Sẽ highlight hầu hết issues
2. **Check console logs** - Look for undefined errors
3. **Test with different roles** - SUPER_ADMIN, HR, USER
4. **Contact backend team** - Nếu cần clarification về permissions

---

## Summary

**What to do**:
1. ✅ Update TypeScript interfaces
2. ✅ Create permission helper functions
3. ✅ Replace `user.permissions` with `can(user, module, action)`
4. ✅ Update route guards
5. ✅ Test with all roles

**What NOT to do**:
- ❌ Don't try to access `user.permissions`
- ❌ Don't try to access `user.password`
- ❌ Don't try to access `user.refreshToken`
- ❌ Don't try to access `user.role.permissions`

**Estimated effort**: 6-11 hours

**Priority**: HIGH - Should be done before next release

---

**Last Updated**: 2026-01-07  
**Backend Version**: 1.0 (Security Update)  
**Contact**: Backend Team
