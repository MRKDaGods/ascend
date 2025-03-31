import { useEffect, useState } from "react";
import { initializeApi, api } from "../services/auth/handlers";
import { TabsContainer, TabGroup } from "../components/common/TabsContainer";
import {
  LoginForm,
  RegisterForm,
  ResendConfirmationEmailForm,
  UpdatePasswordForm,
  UpdateEmailForm,
  ForgetPasswordForm,
  ResetPasswordForm,
  DeleteAccountForm,
  LogoutButton,
  AuthTokenDisplay
} from "../components/auth";
import { UserProfileForm } from "../components/user";
import styles from "../styles/layout.module.css";

// Define the tab groups
const authTabs: TabGroup[] = [
  {
    title: "Authentication",
    tabs: [
      { id: "login", label: "Login" },
      { id: "register", label: "Register" },
      { id: "resendConfirmation", label: "Resend Confirmation" },
    ]
  },
  {
    title: "User Profile",
    tabs: [
      { id: "userProfile", label: "View Profile" },
    ]
  },
  {
    title: "Account Management",
    tabs: [
      { id: "updatePassword", label: "Update Password" },
      { id: "updateEmail", label: "Update Email" },
      { id: "deleteAccount", label: "Delete Account" },
    ]
  },
  {
    title: "Password Recovery",
    tabs: [
      { id: "forgetPassword", label: "Forget Password" },
      { id: "resetPassword", label: "Reset Password" },
    ]
  }
];

type TabId = 'login' | 'register' | 'resendConfirmation' | 'updatePassword' | 
  'updateEmail' | 'forgetPassword' | 'resetPassword' | 'deleteAccount' | 'userProfile';

export default function Home() {
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('login');
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize API client
  useEffect(() => {
    const init = async () => {
      const result = await initializeApi();
      if (result.success) {
        setInitialized(true);
        setInitError(null);
      } else {
        setInitError(result.error?.toString() || "Unknown error");
      }
    };
    
    init();
  }, []);

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      case 'resendConfirmation':
        return <ResendConfirmationEmailForm />;
      case 'updatePassword':
        return <UpdatePasswordForm />;
      case 'updateEmail':
        return <UpdateEmailForm />;
      case 'forgetPassword':
        return <ForgetPasswordForm />;
      case 'resetPassword':
        return <ResetPasswordForm />;
      case 'deleteAccount':
        return <DeleteAccountForm />;
      case 'userProfile':
        return <UserProfileForm />;
      default:
        return <LoginForm />;
    }
  };

  const renderContent = () => {
    if (!initialized) {
      return <p>Initializing API client...</p>;
    }

    if (initError) {
      return (
        <div style={{ color: "red" }}>
          <p>Failed to initialize API client:</p>
          <pre>{initError}</pre>
        </div>
      );
    }

    return (
      <div>
        <LogoutButton />
        
        <TabsContainer 
          groups={authTabs} 
          activeTab={activeTab} 
          onTabChange={(tabId) => setActiveTab(tabId as TabId)} 
        />

        {renderActiveForm()}
        
        <div style={{ marginTop: "20px" }}>
          <AuthTokenDisplay />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>API Client Tester</h1>
        <p className={styles.subtitle}>API URL: {api.baseUrl}</p>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
}
