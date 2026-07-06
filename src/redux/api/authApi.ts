import { baseApi } from './baseApi'
import {
    clearAuthStorage,
    loginSuccess,
    logout as logoutAction,
    persistAuthStorage,
} from '../slice/authSlice'

interface LoginResponse {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: {
        accessToken: string;
        refreshToken?: string;
        role?: string;
    };
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

interface ForgotPasswordPayload {
    email: string;
}

interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

interface ResendOtpPayload {
    email: string;
}

interface ResendOtpResponse {
    success: boolean;
    message: string;
}

interface VerifyEmailPayload {
    email: string;
    oneTimeCode: number;
    purpose?: 'forgot' | 'register';
}

interface VerifyEmailResponse {
    success: boolean;
    message: string;
    data: unknown;
}

export const RESET_PASSWORD_TOKEN_KEY = 'resetPasswordToken';

export function extractResetTokenFromVerifyResponse(
    response: Pick<VerifyEmailResponse, 'data'> | undefined,
): string | null {
    if (response?.data == null) return null;

    let value: unknown = response.data;

    for (let depth = 0; depth < 3; depth++) {
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }

        if (typeof value === 'object' && value !== null) {
            const obj = value as Record<string, unknown>;
            const nested =
                obj.data ?? obj.token ?? obj.accessToken ?? obj.resetToken;

            if (nested !== undefined) {
                value = nested;
                continue;
            }
        }

        break;
    }

    return null;
}

export function persistResetPasswordToken(
    response: Pick<VerifyEmailResponse, 'data'> | undefined,
): void {
    const token = extractResetTokenFromVerifyResponse(response);
    if (!token || typeof localStorage === 'undefined') return;

    localStorage.setItem(RESET_PASSWORD_TOKEN_KEY, token);
}

interface ResetPasswordPayload {
    email: string;
    newPassword: string;
    confirmPassword: string;
}

interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

interface GetMyProfileResponse {
    success: boolean;
    message: string;
    data: UserProfile;
}

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    profileImage: string;
    image: string;
    address: string;
    status: string;
    isVerified: boolean;
    isOnline: boolean;
    isDeleted: boolean;
    authProviders: string[];
    business: unknown | null;
    customer: unknown | null;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface UpdateMyProfileResponse {
    success: boolean;
    message: string;
    data: UserProfile;
}

export interface UpdateMyProfilePayload {
    name?: string;
    phone?: string;
    address?: string;
    profileImage?: string;
}

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(credentials, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    const accessToken = data?.data?.accessToken;
                    if (!data?.success || !accessToken) return;

                    persistAuthStorage({
                        token: accessToken,
                        email: credentials.email,
                        role: data.data?.role,
                        refreshToken: data.data?.refreshToken,
                    })

                    dispatch(
                        loginSuccess({
                            token: accessToken,
                            email: credentials.email,
                            role: data.data?.role,
                        }),
                    )
                } catch {
                    // RTK Query handles mutation errors
                }
            },
            invalidatesTags: ['Auth'],
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        logout: builder.mutation<LoginResponse, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled
                } catch {
                    // still clear local session on logout failure
                } finally {
                    clearAuthStorage()
                    dispatch(logoutAction())
                }
            },
            invalidatesTags: ['Auth'],
        }),
        getCurrentUser: builder.query({
            query: () => ({
                url: '/auth/current-user',
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),
        changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordPayload>({
            query: (credentials) => ({
                url: '/auth/change-password',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordPayload>({
            query: (credentials) => ({
                url: '/auth/forget-password',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        resentOtp: builder.mutation<ResendOtpResponse, ResendOtpPayload>({
            query: (credentials) => ({
                url: '/auth/resend-otp',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailPayload>({
            query: (credentials) => ({
                url: '/auth/verify-email',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data: response } = await queryFulfilled;
                    if (arg.purpose !== 'forgot') return;

                    persistResetPasswordToken(response);
                } catch {
                    // RTK Query handles mutation errors
                }
            },
            invalidatesTags: ['Auth'],
        }),
        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordPayload>({
            query: (credentials) => {
                let resetToken: string | null = null
                try {
                    resetToken =
                        typeof localStorage !== 'undefined'
                            ? localStorage.getItem(RESET_PASSWORD_TOKEN_KEY)
                            : null
                } catch {
                    resetToken = null
                }

                return {
                    url: '/auth/reset-password',
                    method: 'POST',
                    body: {
                        email: credentials.email,
                        newPassword: credentials.newPassword,
                        confirmPassword: credentials.confirmPassword,
                    },
                    ...(resetToken
                        ? { headers: { authorization: resetToken } }
                        : {}),
                }
            },
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    if (typeof localStorage !== 'undefined') {
                        localStorage.removeItem(RESET_PASSWORD_TOKEN_KEY);
                    }
                } catch {
                    // RTK Query handles mutation errors
                }
            },
            invalidatesTags: ['Auth'],
        }),


        getMyProfile: builder.query<GetMyProfileResponse, void>({
            query: () => ({
                url: '/users/profile',
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),

        updateMyProfile: builder.mutation<UpdateMyProfileResponse, UpdateMyProfilePayload>({
            query: (body) => ({
                url: '/users/profile',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Auth'],
        }),


    }),

})

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useVerifyEmailMutation,
    useResetPasswordMutation,
    useResentOtpMutation,
    useGetMyProfileQuery,
    useUpdateMyProfileMutation,
} =
    authApi