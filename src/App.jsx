import React from 'react';
import { AppProvider, AppContent } from './AppContent';

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
