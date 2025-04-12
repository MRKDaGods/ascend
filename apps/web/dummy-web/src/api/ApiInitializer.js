import { api } from "./apiDef";

const React = require("react");
const { useEffect, useState } = React;

export const ApiInitializer = ({ content }) => {
  const [retry, setRetry] = useState(false);
  const [initState, setInitState] = useState({
    initializing: true,
    error: "",
  });

  const initializeApi = async () => {
    try {
      if (!api.initialized) {
        console.log("Initializing API client...");

        setInitState({ initializing: true, error: "" });
        await api.initialize();

        console.log("API client initialized successfully.");
      }
    } catch (error) {
      console.error("Error initializing API client:", error);
      setInitState({
        initializing: false,
        error: `Failed to initialize API client ${error}`,
      });
    } finally {
      setInitState(prevState => ({ ...prevState, initializing: false }));
    }
  };

  useEffect(() => {
    initializeApi();
  }, []);

  useEffect(() => {
    if (retry) {
      initializeApi().finally(() => {
        setRetry(false);
      });
    }
  }, [retry]);

  if (initState.initializing) {
    return (
      <div className="api-loading">
        <p>Initializing API...</p>
        <div className="loader"></div>
      </div>
    );
  }

  if (initState.error) {
    return (
      <div className="api-error">
        <h3>Error</h3>
        <p>{initState.error}</p>
        <button 
          className="retry-button" 
          onClick={() => setRetry(true)}
        >
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
        <button 
          className="retry-button"
          onClick={() => setRetry(true)}
        >
          Retry Initialization
        </button>
      </div>
    );
  }

  return <>{content ? content() : null}</>;
};
