import { api } from "@/api";

export async function handleLogin(email: string, password: string) {
  try {
    await api.initialize();
    const { token, user_id } = await api.auth.login(email, password);
    console.log(`Successfully logged in as user ID: ${user_id}`);
    console.log(`Received token: ${token}`);
    return { success: true, user_id, token };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error };
  }
}

export async function handleRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  try {
    await api.initialize();
    const result = await api.auth.register(firstName, lastName, email, password);
    console.log(`Successfully registered user ID: ${result.user_id}`);
    return { success: true, ...result };
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, error };
  }
}

export async function handleResendConfirmationEmail(email: string) {
  try {
    await api.initialize();
    await api.auth.resendConfirmationEmail(email);
    console.log(`Confirmation email resent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to resend confirmation email:", error);
    return { success: false, error };
  }
}

export async function handleUpdatePassword(oldPassword: string, newPassword: string) {
  try {
    await api.initialize();
    await api.auth.updatePassword(oldPassword, newPassword);
    console.log("Password updated successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to update password:", error);
    return { success: false, error };
  }
}

export async function handleUpdateEmail(newEmail: string) {
  try {
    await api.initialize();
    await api.auth.updateEmail(newEmail);
    console.log(`Email update initiated for: ${newEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update email:", error);
    return { success: false, error };
  }
}

export async function handleForgetPassword(email: string) {
  try {
    await api.initialize();
    await api.auth.forgetPassword(email);
    console.log(`Password reset requested for: ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to request password reset:", error);
    return { success: false, error };
  }
}

export async function handleResetPassword(token: string, newPassword: string) {
  try {
    await api.initialize();
    await api.auth.resetPassword(token, newPassword);
    console.log("Password reset successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to reset password:", error);
    return { success: false, error };
  }
}

export async function handleDeleteAccount() {
  try {
    await api.initialize();
    await api.auth.deleteAccount();
    console.log("Account deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete account:", error);
    return { success: false, error };
  }
}

export async function handleLogout() {
  try {
    await api.initialize();
    await api.auth.logout();
    console.log("Logged out successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to logout:", error);
    return { success: false, error };
  }
}

export function getAuthToken() {
  try {
    const currentToken = api.auth.authToken;
    return { success: true, token: currentToken };
  } catch (err: any) {
    return { success: false, error: err.toString() };
  }
}

export { api };
