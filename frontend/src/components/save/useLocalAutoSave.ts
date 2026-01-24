import type { RefObject } from 'react';
import { useEffect } from 'react'

// Value represented in seconds
const autoSaveInterval = 10; // e.g. 10 = call the local auto save every 10s
const legacyKeyPrefix = 'Saved Element #';

function useLocalAutoSave(
  storageKey: string,
  rootRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const localAutoSave = () => {
      const root = rootRef?.current ?? document.body;
      const pageElements = Array.from(
        root.querySelectorAll(
          '[data-editable][data-editable-leaf="true"]'
        )
      );

      if (!pageElements.length) {
        return;
      }

      const pageSnapshot = pageElements.map((editableElement) => ({
        id: editableElement.getAttribute('data-editable-id') ?? '',
        text: editableElement.textContent ?? '',
      }));

      try {
        localStorage.setItem(storageKey, JSON.stringify(pageSnapshot));

        Object.keys(localStorage)
          .filter((key) => key.startsWith(legacyKeyPrefix))
          .forEach((key) => localStorage.removeItem(key));
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.error('Local storage exceeded!');
        }
      }
    };

    const localAutoSaveCall = setInterval(localAutoSave, autoSaveInterval * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localAutoSave();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      localAutoSave();
      clearInterval(localAutoSaveCall);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [storageKey, rootRef]);
}

export default useLocalAutoSave;