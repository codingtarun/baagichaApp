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

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  preferred_language?: 'en' | 'hi';
  notifications_enabled?: boolean;
  location_enabled?: boolean;
}

export async function updateProfile(
  data: UpdateProfileRequest
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

// ── Password Reset ──

export interface ForgotPasswordRequest {
  email: string;
}

export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ApiResponse<null>> {
  const response = await api.post<ApiResponse<null>>('/auth/forgot-password', data);
  return response.data;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ApiResponse<null>> {
  const response = await api.post<ApiResponse<null>>('/auth/reset-password', data);
  return response.data;
}

// ── Email Verification ──

export async function getEmailVerificationStatus(): Promise<
  ApiResponse<{ verified: boolean; email: string | null }>
> {
  const response = await api.get<ApiResponse<{ verified: boolean; email: string | null }>>(
    '/auth/email/status'
  );
  return response.data;
}

export async function resendEmailVerification(): Promise<ApiResponse<null>> {
  const response = await api.post<ApiResponse<null>>('/auth/email/resend');
  return response.data;
}

// ── Device Tokens ──

export interface RegisterDeviceRequest {
  token: string;
  platform: 'android' | 'ios';
}

export async function registerDevice(
  data: RegisterDeviceRequest
): Promise<ApiResponse<{ id: number; linked: boolean }>> {
  const response = await api.post<ApiResponse<{ id: number; linked: boolean }>>(
    '/devices/register',
    data
  );
  return response.data;
}

export async function unregisterDevice(token: string): Promise<ApiResponse<null>> {
  const response = await api.delete<ApiResponse<null>>('/devices/unregister', {
    data: { token },
  });
  return response.data;
}

export async function linkDevices(tokens: string[]): Promise<ApiResponse<{ linked_count: number }>> {
  const response = await api.post<ApiResponse<{ linked_count: number }>>('/devices/link', {
    tokens,
  });
  return response.data;
}
