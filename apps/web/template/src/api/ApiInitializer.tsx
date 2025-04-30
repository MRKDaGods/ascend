import React, { useEffect, useState } from "react";
import { api } from "./apiDef";
import LoadingPage from "@/app/components/LoadingPage";
import { useRouter, usePathname } from "next/navigation";

type InitState = {
  initializing: boolean;
  error: string;
};

type ApiInitializerProps = {
  content?: () => React.ReactNode;
};

// Routes that require authentication
const PROTECTED_ROUTES = ["/feed", "/profile", "/chat", "/notif", "/network", "/jobs"];

export const AUTH_STATE_CHANGE_EVENT = "auth_state_change";

// Export function to trigger auth state refresh
export const refreshAuthState = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
};

export const ApiInitializer: React.FC<ApiInitializerProps> = ({ content }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [retry, setRetry] = useState(false);
  const [initState, setInitState] = useState<InitState>({
    initializing: true,
    error: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const initializeApi = async () => {
    try {
      if (!api.initialized) {
        console.log("Initializing API client...");
        setInitState({ initializing: true, error: "" });

        await api.initialize();

        console.log("API client initialized successfully.");
      }

      // Check authentication after API initialization
      if (api.initialized) {
        await checkAuthentication();
      }
    } catch (error) {
      console.error("Error initializing API client:", error);
      setInitState({
        initializing: false,
        error: `Failed to initialize API client: ${String(error)}`,
      });
    } finally {
      setInitState((prevState) => ({
        ...prevState,
        initializing: false,
      }));
    }
  };

  const navigateTo = (path: string) => {
    setNavigating(true);
    console.log(`Navigating to: ${path}`);
    router.push(path);

    // Add a small delay to ensure navigation begins before rendering content
    // This helps avoid UI flashes during navigation
    setTimeout(() => {
      setNavigating(false);
    }, 300);
  };

  const checkAuthentication = async () => {
    try {
      setCheckingAuth(true);
      // Check if we have a token first
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.log("No auth token found, setting isAuthenticated to false");
        setIsAuthenticated(false);
        return;
      }

      // Validate the token by attempting to get user profile
      await api.user.getLocalUserProfile();
      console.log("Authentication successful, setting isAuthenticated to true");
      setIsAuthenticated(true);

      // If we're on the authentication page and just confirmed we're logged in
      // Navigate to feed directly
      if (pathname?.startsWith("/authen")) {
        console.log("Authenticated on auth page, navigating to feed");
        navigateTo("/feed");
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      try {
        await api.auth.logout();
        console.log("User logged out due to invalid token");
      } catch (logoutError) {
        console.error("Error during logout:", logoutError);
        // Fallback: manually remove token if logout API fails
        localStorage.removeItem("auth_token");
      }
      console.log("Setting isAuthenticated to false after error");
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    initializeApi();
  }, []);

  useEffect(() => {
    if (retry) {
      initializeApi().finally(() => setRetry(false));
    }
  }, [retry]);

  // Add event listener for auth state changes
  useEffect(() => {
    const handleAuthChange = async () => {
      console.log(
        "Auth state change detected, refreshing authentication status"
      );
      await checkAuthentication();
      console.log(
        "Authentication check completed, current state:",
        isAuthenticated
      );
    };

    window.addEventListener(AUTH_STATE_CHANGE_EVENT, handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGE_EVENT, handleAuthChange);
    };
  }, [isAuthenticated]);

  // Handle redirection for protected routes
  useEffect(() => {
    // Don't redirect while initializing or checking auth
    if (initState.initializing || checkingAuth) {
      return;
    }

    // We've already handled navigation to feed in checkAuthentication
    // This is primarily for handling unauthorized users now
    if (pathname === "/" || pathname?.startsWith("/authen")) {
      if (isAuthenticated) {
        navigateTo("/feed");
      }
      return;
    }

    if (!isAuthenticated) {
      // Check if current route requires authentication
      if (PROTECTED_ROUTES.some((route) => pathname?.startsWith(route))) {
        console.log("User not authenticated. Redirecting to login...");
        navigateTo("/authen");
      }
    }
  }, [isAuthenticated, pathname, router, initState.initializing, checkingAuth]);

  // Don't show any content while checking authentication or during navigation
  if (initState.initializing || checkingAuth || navigating) {
    return <LoadingPage />;
  }

  if (initState.error) {
    return (
      <div className="api-error">
        <h3>Error</h3>
        <p>{initState.error}</p>
        <button className="retry-button" onClick={() => setRetry(true)}>
          Retry Connection
        </button>
      </div>
    );
  }

  if (!api.initialized) {
    return (
      <div className="api-error">
        <h3>API Not Initialized</h3>
        <p>Unable to initialize the API client.</p>
        <button className="retry-button" onClick={() => setRetry(true)}>
          Retry Initialization
        </button>
      </div>
    );
  }

  return <>{content ? content() : null}</>;
};
