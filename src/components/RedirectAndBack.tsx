import React, { useEffect } from 'react';

interface RedirectAndBackProps {
  /** The URL to open in a new tab */
  url: string;
}

/**
 * A React component that, when rendered, opens the given URL in a new tab
 * and then navigates the current page back in history.
 */
const RedirectAndBack: React.FC<RedirectAndBackProps> = ({ url }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Open the URL in a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    // Go back to the previous page in history
    window.history.back();
  }, [url]);

  // This component does not render anything visible
  return null;
};

export default RedirectAndBack;
