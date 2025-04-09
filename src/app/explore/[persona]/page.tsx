'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Persona } from '@/types/persona';

export default function PersonaPage() {
  const params = useParams();
  const router = useRouter();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPersona() {
      try {
        const personaId = params.persona;
        const response = await fetch('/data/personas.json');
        const data = await response.json();
        
        const foundPersona = data.personas.find((p: Persona) => p.id === personaId);
        
        if (foundPersona) {
          setPersona(foundPersona);
        } else {
          // Redirect to home if persona not found
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading persona:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPersona();
  }, [params.persona, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#1D3557]">Loading...</div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#E63946]">Persona not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1FAEE] text-[#333333]">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-[#1D3557] hover:underline">
              ← Back to Persona Selection
            </Link>
            <h2 className="text-2xl font-semibold text-[#457B9D]">
              Zurich Perspectives
            </h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="h-64 bg-[#457B9D] rounded-lg flex items-center justify-center text-white">
                  <span className="text-6xl font-light">{persona.name}</span>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold text-[#1D3557] mb-2">
                  {persona.fullName}
                </h1>
                <h2 className="text-xl text-[#457B9D] mb-4">
                  {persona.occupation}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{persona.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{persona.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Annual Income</p>
                    <p className="font-medium">CHF {persona.income.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tax Multiplier</p>
                    <p className="font-medium">{persona.taxMultiplier}%</p>
                  </div>
                </div>
                
                <p className="mb-6">{persona.shortBio}</p>
                
                <div>
                  <h3 className="font-semibold mb-2">Key Characteristics:</h3>
                  <ul className="list-disc pl-5">
                    {persona.characteristics.map((characteristic, index) => (
                      <li key={index}>{characteristic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              Explore {persona.name}'s Experience
            </h3>
            <p className="mb-6">
              Follow {persona.name}'s journey through Zurich's economic and political systems.
              Discover how taxation, public spending, political influence, and voter engagement
              shape {persona.name}'s experience of democracy.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href={`/explore/${persona.id}/taxation`}
                className="block py-2 px-4 bg-[#1D3557] text-white text-center rounded hover:bg-[#2a4a76] transition-colors"
              >
                Taxation
              </Link>
              <Link 
                href={`/explore/${persona.id}/spending`}
                className="block py-2 px-4 bg-[#1D3557] text-white text-center rounded hover:bg-[#2a4a76] transition-colors"
              >
                Public Spending
              </Link>
              <Link 
                href={`/explore/${persona.id}/influence`}
                className="block py-2 px-4 bg-[#1D3557] text-white text-center rounded hover:bg-[#2a4a76] transition-colors"
              >
                Political Influence
              </Link>
              <Link 
                href={`/explore/${persona.id}/engagement`}
                className="block py-2 px-4 bg-[#1D3557] text-white text-center rounded hover:bg-[#2a4a76] transition-colors"
              >
                Voter Engagement
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              Compare with Other Personas
            </h3>
            <p className="mb-6">
              See how {persona.name}'s experience compares with others across the socioeconomic spectrum.
              Understanding these differences helps illustrate how economic inequality translates into
              political inequality in Zurich.
            </p>
            <div className="space-y-4">
              {persona.id !== 'anna' && (
                <Link 
                  href="/explore/anna"
                  className="block py-2 px-4 bg-[#457B9D] text-white text-center rounded hover:bg-[#5a8cad] transition-colors"
                >
                  Compare with Anna
                </Link>
              )}
              {persona.id !== 'leo' && (
                <Link 
                  href="/explore/leo"
                  className="block py-2 px-4 bg-[#457B9D] text-white text-center rounded hover:bg-[#5a8cad] transition-colors"
                >
                  Compare with Leo
                </Link>
              )}
              {persona.id !== 'millionaire' && (
                <Link 
                  href="/explore/millionaire"
                  className="block py-2 px-4 bg-[#457B9D] text-white text-center rounded hover:bg-[#5a8cad] transition-colors"
                >
                  Compare with Thomas
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
