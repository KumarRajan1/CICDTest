// src/components/CallbackExample.js
import React, { useEffect } from 'react';

function CallbackExample() {
  useEffect(() => {
    // Define the callback method first
    function callBackMethod(e) {
      console.log(e);
    }

    // Use the callback method in your object
    const config = {
      clickableIconsCallback: callBackMethod,
      token_callback: callBackMethod
    };

    // Example usage
    config.clickableIconsCallback("Icon clicked");  // Logs "Icon clicked"
    config.token_callback({ error: "Token Expired", code: 401 });  // Logs "{ error: 'Token Expired', code: 401 }"
  }, []);

  return (
    <div>
      <h1>Callback Example</h1>
      <p>Check the console for callback results.</p>
    </div>
  );
}

export default CallbackExample;
