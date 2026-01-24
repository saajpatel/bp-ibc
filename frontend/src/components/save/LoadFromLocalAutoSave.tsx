import type { RefObject } from 'react';
import { useEffect } from 'react';

type LoadFromLocalAutoSaveProps = {
  storageKey: string;
  useDefaultTemplate?: boolean;
  rootRef?: RefObject<HTMLElement | null>;
  ready?: boolean;
};

const placeholderSnippets = [
  'Click me! then double-click me!',
  '>hello<',
  'good morning!',
];

function LoadFromLocalAutoSave({
  storageKey,
  useDefaultTemplate = false,
  rootRef,
  ready = true,
}: LoadFromLocalAutoSaveProps) {
  useEffect(() => {
    if (useDefaultTemplate) {
      return;
    }

    if (!ready) {
      return;
    }

    const root = rootRef?.current ?? document.body;

    const applySnapshot = (targetKey: string, selector: string) => {
      const rawSaved = localStorage.getItem(targetKey);
      if (!rawSaved) {
        return;
      }

      let savedElements: Array<{ id: string; text: string }> = [];
      let legacyElements: string[] = [];

      try {
        const parsed = JSON.parse(rawSaved) as unknown;
        if (Array.isArray(parsed)) {
          savedElements = parsed.filter(
            (element) =>
              typeof element === 'object' &&
              element !== null &&
              'id' in element &&
              'text' in element
          ) as Array<{ id: string; text: string }>;

          legacyElements = parsed.filter(
            (element) => typeof element === 'string'
          ) as string[];
        }
      } catch {
        savedElements = [];
        legacyElements = [];
      }

      if (!savedElements.length && legacyElements.length) {
        savedElements = legacyElements.map((value, index) => ({
          id: String(index),
          text: value,
        }));
      }

      const normalizedElements = savedElements.map((value) => {
        if (value.text.includes('<') && value.text.includes('>')) {
          const temp = document.createElement('div');
          temp.innerHTML = value.text;
          return { ...value, text: temp.textContent ?? '' };
        }

        return value;
      });

      if (normalizedElements.some((value, index) => value !== savedElements[index])) {
        localStorage.setItem(targetKey, JSON.stringify(normalizedElements));
      }

      savedElements = normalizedElements;

      const hasPlaceholderContent = savedElements.some((elementText) =>
        placeholderSnippets.some((snippet) => elementText.text.includes(snippet))
      );

      if (hasPlaceholderContent) {
        localStorage.removeItem(targetKey);
        return;
      }

      const editableElements = Array.from(root.querySelectorAll(selector));

      if (!editableElements.length || !savedElements.length) {
        return;
      }

      const editableMap = new Map(
        editableElements
          .map((element) => [element.getAttribute('data-editable-id') ?? '', element])
          .filter(([key]) => key)
      );

      const shouldApply = savedElements.some((value) => {
        const target = editableMap.get(value.id);
        if (!target) {
          return false;
        }

        return value.text !== (target.textContent ?? '');
      });

      if (!shouldApply) {
        return;
      }

      savedElements.forEach((value) => {
        const target = editableMap.get(value.id);
        if (target) {
          target.textContent = value.text;
        }
      });
    };

    applySnapshot(storageKey, '[data-editable][data-editable-leaf="true"]');
  }, [storageKey, useDefaultTemplate, ready, rootRef]);

  return null;
}

export default LoadFromLocalAutoSave;