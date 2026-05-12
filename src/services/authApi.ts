/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — AUTH API SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * Supports 3 authentication methods:
 *   1. Email + Password
 *   2. Phone + OTP
 *   3. Social OAuth (Google, Facebook)
 */

import { api } from './api';
import type { User } from '../store/authStore';

// ── Types ──

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  user: User;
  token: string;
  is_new_user?: boolean;
}

// ── Email + Password ──

export interface EmailRegisterRequest {
  name?: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  preferred_language?: 'en' | 'hi';
}

export interface EmailLoginRequest {
  login: string; // email or phone
  password: string;
  device_name?: string;
}

export async function registerByEmail(
  data: EmailRegisterRequest
): Promise<ApiResponse<AuthResponse>> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
  return response.data;
}

export async function loginByEmail(
  data: EmailLoginRequest
): Promise<ApiResponse<AuthResponse>> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return response.data;
}

// ── Phone + OTP ──

export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  phone: string;
  expires_in_seconds: number;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  device_name?: string;
}

export async function sendOtp(
  data: SendOtpRequest
): Promise<ApiResponse<SendOtpResponse>> {
  const response = await api.post<ApiResponse<SendOtpResponse>>('/auth/otp/send', data);
  return response.data;
}

export async function verifyOtp(
  data: VerifyOtpRequest
): Promise<ApiResponse<AuthResponse>> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/otp/verify', data);
  return response.data;
}

// ── Social OAuth ──

export interface SocialAuthRequest {
  provider: 'google' | 'facebook';
  token: string;
  device_name?: string;
}

export async function loginBySocial(
  data: SocialAuthRequest
): Promise<ApiResponse<AuthResponse>> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/social', data);
  return response.data;
}

// ── Existing (no change) ──

export async function logout(): Promise<ApiResponse<null>> {
  const response = await api.post<ApiResponse<null>>('/auth/logout');
  return response.data;
}

export async function getProfile(): Promise<ApiResponse<{ user: User }>> {
  const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
  return response.data;
}

export async function updateProfile(
  data: Partial<User>
): Promise<ApiResponse<{ user: User }>> {
  const response = await api.put<ApiResponse<{ user: User }>>('/auth/profile', data);
  return response.data;
}

export async function refreshToken(
  deviceName?: string
): Promise<ApiResponse<{ token: string }>> {
  const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh', {
    device_name: deviceName,
  });
  return response.data;
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export async function changePassword(
  data: ChangePasswordRequest
): Promise<ApiResponse<null>> {
  const response = await api.post<ApiResponse<null>>('/auth/change-password', data);
  return response.data;
}
