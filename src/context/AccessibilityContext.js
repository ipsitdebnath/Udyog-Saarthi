import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import storage from '../utils/storage';
import { Colors } from '../constants/Colors';

const AccessibilityContext = createContext({
  fontScale: 1,
  highContrast: false,
  soundAssistance: false,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
  toggleHighContrast: () => {},
  toggleSoundAssistance: () => {},
  resetSettings: () => {},
  speak: () => {},
  stopSpeaking: () => {},
  themeColors: Colors.light,
});

export const AccessibilityProvider = ({ children }) => {
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [soundAssistance, setSoundAssistance] = useState(false);

  // Restore saved accessibility settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await storage.getItem(storage.KEYS.ACCESSIBILITY_SETTINGS);
        if (saved) {
          if (typeof saved.fontScale === 'number') setFontScale(saved.fontScale);
          if (typeof saved.highContrast === 'boolean') setHighContrast(saved.highContrast);
          if (typeof saved.soundAssistance === 'boolean') setSoundAssistance(saved.soundAssistance);
        }
      } catch (err) {
        console.warn('Failed to load accessibility settings:', err);
      }
    };
    loadSettings();
  }, []);

  // Save settings on update
  const persist = async (newScale, newContrast, newSound) => {
    try {
      await storage.setItem(storage.KEYS.ACCESSIBILITY_SETTINGS, {
        fontScale: newScale,
        highContrast: newContrast,
        soundAssistance: newSound,
      });
    } catch (err) {
      console.warn('Failed to persist accessibility settings:', err);
    }
  };

  const increaseFontSize = () => {
    setFontScale((prev) => {
      const next = prev < 1.4 ? Math.round((prev + 0.1) * 10) / 10 : prev;
      persist(next, highContrast, soundAssistance);
      if (soundAssistance) speak(`Text size increased to ${Math.round(next * 100)} percent`);
      return next;
    });
  };

  const decreaseFontSize = () => {
    setFontScale((prev) => {
      const next = prev > 0.9 ? Math.round((prev - 0.1) * 10) / 10 : prev;
      persist(next, highContrast, soundAssistance);
      if (soundAssistance) speak(`Text size decreased to ${Math.round(next * 100)} percent`);
      return next;
    });
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      persist(fontScale, next, soundAssistance);
      if (soundAssistance) speak(next ? 'High contrast mode enabled' : 'High contrast mode disabled');
      return next;
    });
  };

  const toggleSoundAssistance = () => {
    setSoundAssistance((prev) => {
      const next = !prev;
      persist(fontScale, highContrast, next);
      if (next) {
        speak('Voice audio assistance is now turned on.');
      } else {
        Speech.stop();
      }
      return next;
    });
  };

  const resetSettings = () => {
    setFontScale(1);
    setHighContrast(false);
    setSoundAssistance(false);
    persist(1, false, false);
    Speech.stop();
  };

  const speak = (text) => {
    if (!text) return;
    try {
      Speech.stop();
      Speech.speak(text, {
        language: 'en-IN',
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (e) {
      console.warn('Expo Speech error:', e);
    }
  };

  const stopSpeaking = () => {
    try {
      Speech.stop();
    } catch (e) {
      console.warn('Expo Speech stop error:', e);
    }
  };

  const themeColors = highContrast ? Colors.highContrast : Colors.light;

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        highContrast,
        soundAssistance,
        increaseFontSize,
        decreaseFontSize,
        toggleHighContrast,
        toggleSoundAssistance,
        resetSettings,
        speak,
        stopSpeaking,
        themeColors,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
