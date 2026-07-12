import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  roles: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  employeeId: number | null;
}

const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const res = await api.post('/auth/login', credentials);
    const data: LoginResponse = res.data.data;
    localStorage.setItem('erp_token', data.token);
    localStorage.setItem('erp_user', JSON.stringify(data));
    return data;
  },

  async forgotPassword(email: string): Promise<string> {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data.message || 'OTP sent to your email address';
  },

  async verifyResetOtp(email: string, otp: string): Promise<string> {
    const res = await api.post('/auth/verify-reset-otp', { email, otp });
    return res.data.message || 'OTP verified successfully';
  },

  async resetPassword(request: ResetPasswordRequest): Promise<string> {
    const res = await api.post('/auth/reset-password', request);
    return res.data.message || 'Password reset successfully';
  },

  async getCurrentUser(): Promise<CurrentUser> {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  logout() {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('erp_token');
  },

  getUser(): LoginResponse | null {
    const user = localStorage.getItem('erp_user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
