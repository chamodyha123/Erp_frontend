import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  roles: string[];
  enabled: boolean;
  employeeId?: number | null;
  employeeName?: string | null;
  lastLogin?: string | null;
  createdAt?: string | null;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  enabled?: boolean;
  employeeId?: number | null;
}

export interface UpdateUserRequest {
  email?: string;
  role?: string;
  enabled?: boolean;
  employeeId?: number | null;
}

interface BackendUser {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  employeeId?: number | null;
  employeeName?: string | null;
  roles?: string[];
  lastLogin?: string | null;
  createdAt?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

const normalizeUser = (user: BackendUser): User => ({
  id: user.id,
  username: user.username,
  email: user.email,
  roles: user.roles ?? [],
  role: user.roles?.[0] ?? 'EMPLOYEE',
  enabled: user.isActive ?? false,
  employeeId: user.employeeId,
  employeeName: user.employeeName,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});

const userService = {
  async getAll(): Promise<User[]> {
    const response =
      await api.get<ApiResponse<BackendUser[]>>('/users');

    const users = response.data.data;

    if (!Array.isArray(users)) {
      return [];
    }

    return users.map(normalizeUser);
  },

  async getById(id: number): Promise<User> {
    const response =
      await api.get<ApiResponse<BackendUser>>(`/users/${id}`);

    return normalizeUser(response.data.data);
  },

  async create(data: CreateUserRequest): Promise<User> {
    const response = await api.post<ApiResponse<BackendUser>>(
      '/users',
      {
        username: data.username,
        email: data.email,
        password: data.password,
        employeeId: data.employeeId ?? null,
        roles: [data.role],
      },
    );

    return normalizeUser(response.data.data);
  },

  async update(
    id: number,
    data: UpdateUserRequest,
  ): Promise<User> {
    const response = await api.put<ApiResponse<BackendUser>>(
      `/users/${id}`,
      {
        email: data.email,
        isActive: data.enabled,
        employeeId: data.employeeId ?? null,
        roles: data.role ? [data.role] : undefined,
      },
    );

    return normalizeUser(response.data.data);
  },

  async changePassword(
    id: number,
    password: string,
  ): Promise<void> {
    await api.patch(`/users/${id}/password`, {
      newPassword: password,
    });
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

export default userService;