import { Persona } from '@/types/persona';

export interface PersonaContextType {
  selectedPersona: Persona | null;
  setSelectedPersona: (persona: Persona) => void;
}

export interface PersonaProviderProps {
  children: React.ReactNode;
}

'use client';

import React, { createContext, useState, useContext } from 'react';
import { Persona } from '@/types/persona';

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: PersonaProviderProps) {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  return (
    <PersonaContext.Provider value={{ selectedPersona, setSelectedPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
