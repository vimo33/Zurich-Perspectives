'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Persona } from '@/types/persona';

export default function SynthesisPage() {
  const params = useParams();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load persona data
        const personaResponse = await fetch('/data/personas.json');
        const personaData = await personaResponse.json();
        const foundPersona = personaData.personas.find((p: Persona) => p.id === params.persona);
        
        if (foundPersona) {
          setPersona(foundPersona);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.persona]);

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
        <div className="text-2xl text-[#E63946]">Error loading data</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1FAEE] text-[#333333]">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <Link href={`/explore/${persona.id}`} className="text-[#1D3557] hover:underline">
              ← Back to {persona.name}'s Profile
            </Link>
            <h2 className="text-2xl font-semibold text-[#457B9D]">
              Zurich Perspectives
            </h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#1D3557] mb-6">
              Synthesis & Reflection
            </h1>
            
            <div className="flex items-center mb-8">
              <div className="h-16 w-16 bg-[#457B9D] rounded-full flex items-center justify-center text-white mr-4">
                <span className="text-2xl font-light">{persona.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{persona.name}</h2>
                <p className="text-[#457B9D]">{persona.occupation}</p>
              </div>
            </div>
            
            <p className="mb-8">
              You've now explored Zurich's democratic systems through {persona.name}'s eyes. This final section 
              brings together key insights from all previous sections and invites you to reflect on the 
              relationship between economic inequality and democratic participation in Zurich.
            </p>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            Key Insights from {persona.name}'s Perspective
          </h3>
          
          <div className="space-y-6">
            <div className="p-4 border-l-4 border-[#457B9D]">
              <h4 className="font-semibold mb-2">Taxation & Income</h4>
              <p>
                {persona.id === 'anna' 
                  ? "As a middle-income resident living in Zurich City, Anna pays a moderate tax rate with a municipal multiplier of 119%. Her effective tax rate is approximately 11.6% of her income, placing her in the middle of the tax burden spectrum."
                  : persona.id === 'leo' 
                    ? "As a lower-income resident living in Schlieren, Leo pays a lower absolute amount in taxes but faces a municipal multiplier of 111%. Despite his lower income, his effective tax rate is approximately 9.8% of his income."
                    : "As a high-income resident living in Küsnacht, Thomas benefits from one of the canton's lowest municipal multipliers at 73%. Despite his high income, this favorable rate means his effective tax rate is approximately 12.9% of his income, only slightly higher than middle-income residents in less wealthy municipalities."}
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-[#A8DADC]">
              <h4 className="font-semibold mb-2">Public Spending Benefits</h4>
              <p>
                {persona.id === 'anna' 
                  ? "Anna receives moderate benefits from public spending, particularly in transportation and healthcare. Her tax-to-benefit ratio is relatively balanced, though she may not fully utilize all services her taxes support."
                  : persona.id === 'leo' 
                    ? "Leo receives significant benefits from public spending, particularly in healthcare, transportation, and occasionally social welfare. His tax-to-benefit ratio shows he receives more in services than he contributes in taxes."
                    : "Thomas contributes significantly in taxes but utilizes relatively few public services directly, often opting for private alternatives in education and healthcare. His tax-to-benefit ratio shows he contributes more than he directly receives in benefits."}
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-[#1D3557]">
              <h4 className="font-semibold mb-2">Political Influence</h4>
              <p>
                {persona.id === 'anna' 
                  ? "Anna has limited direct access to politicians and moderate indirect access through professional associations. Her ability to influence policy is constrained by both financial limitations and time constraints."
                  : persona.id === 'leo' 
                    ? "Leo has very limited direct access to politicians and minimal indirect access through unions or community organizations. His ability to influence policy is severely constrained by financial limitations, time constraints, and information barriers."
                    : "Thomas has significant direct access to politicians through business networks and strong indirect access through industry associations. His financial resources allow him to make political donations and participate in exclusive events with decision-makers."}
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-[#E63946]">
              <h4 className="font-semibold mb-2">Voter Engagement</h4>
              <p>
                {persona.id === 'anna' 
                  ? "As a middle-income resident, Anna votes in most federal elections and approximately half of referendums. Her political participation is moderate, limited primarily by time constraints due to work and family responsibilities."
                  : persona.id === 'leo' 
                    ? "As a lower-income resident, Leo votes occasionally in major federal elections but rarely participates in referendums. His political participation is low, limited by severe time constraints, information barriers, and skepticism about his ability to influence outcomes."
                    : "As a high-income resident, Thomas votes consistently in federal elections and most referendums. His political participation is high, facilitated by greater control over his schedule, excellent access to information, and confidence in his ability to influence outcomes."}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            The Cycle of Economic and Political Inequality
          </h3>
          
          <p className="mb-6">
            Through {persona.name}'s journey, we've seen how economic inequality translates into political 
            inequality through multiple reinforcing mechanisms:
          </p>
          
          <div className="relative mb-8">
            <div className="flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border-4 border-[#1D3557] flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#1D3557]">Economic &</div>
                    <div className="text-xl font-bold text-[#1D3557]">Political</div>
                    <div className="text-xl font-bold text-[#1D3557]">Inequality</div>
                  </div>
                </div>
                
                {/* Top position */}
                <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 w-48 p-2 bg-[#E63946] text-white rounded text-center">
                  <p className="font-semibold">Differential Tax Burden</p>
                  <p className="text-xs">Wealthy areas have lower tax rates</p>
                </div>
                
                {/* Right position */}
                <div className="absolute top-1/2 -right-56 transform -translate-y-1/2 w-48 p-2 bg-[#457B9D] text-white rounded text-center">
                  <p className="font-semibold">Unequal Political Access</p>
                  <p className="text-xs">Wealth provides greater influence</p>
                </div>
                
                {/* Bottom position */}
                <div className="absolute -bottom-28 left-1/2 transform -translate-x-1/2 w-48 p-2 bg-[#1D3557] text-white rounded text-center">
                  <p className="font-semibold">Differential Participation</p>
                  <p className="text-xs">Higher-income voters participate more</p>
                </div>
                
                {/* Left position */}
                <div className="absolute top-1/2 -left-56 transform -translate-y-1/2 w-48 p-2 bg-[#A8DADC] text-[#1D3557] rounded text-center">
                  <p className="font-semibold">Policy Alignment</p>
                  <p className="text-xs">Policies favor higher-income preferences</p>
                </div>
              </div>
            </div>
            
            {/* Arrows */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#1D3557" />
                </marker>
              </defs>
              <path d="M200,72 A100,100 0 0,1 300,200" fill="none" stroke="#1D3557" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <path d="M300,200 A100,100 0 0,1 200,328" fill="none" stroke="#1D3557" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <path d="M200,328 A100,100 0 0,1 100,200" fill="none" stroke="#1D3557" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <path d="M100,200 A100,100 0 0,1 200,72" fill="none" stroke="#1D3557" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </svg>
          </div>
          
          <p className="mb-6">
            This cycle creates a self-reinforcing system where economic advantages translate into political advantages, 
            which in turn help maintain and expand economic advantages. The result is a democratic system that, 
            despite its formal equality, produces outcomes that disproportionately reflect the preferences of 
            higher-income residents.
          </p>
          
          <div className="p-4 bg-[#F1FAEE] rounded-lg">
            <h4 className="font-semibold mb-2">{persona.name}'s Position in This Cycle:</h4>
            <p>
              {persona.id === 'anna' 
                ? "As a middle-income resident, Anna occupies an intermediate position in this cycle. She has moderate political influence and participation, but faces significant constraints compared to higher-income residents. Her experience illustrates the 'middle squeeze' in Zurich's democracy."
                : persona.id === 'leo' 
                  ? "As a lower-income resident, Leo is disadvantaged at every point in this cycle. He faces higher effective tax rates in his municipality, receives limited political access, participates less in voting, and sees policies that often don't align with his preferences. His experience illustrates the compounding nature of economic and political inequality."
                  : "As a high-income resident, Thomas benefits at every point in this cycle. He enjoys lower tax rates in his wealthy municipality, has significant political access, participates actively in voting, and sees policies that generally align with his preferences. His experience illustrates how economic advantages translate into political advantages."}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            Reflection Questions
          </h3>
          
          <p className="mb-6">
            Consider these questions as you reflect on what you've learned through {persona.name}'s perspective:
          </p>
          
          <div className="space-y-4">
            <div className="p-4 border border-[#457B9D] rounded-lg">
              <p className="font-semibold">How does economic inequality affect the functioning of democracy in Zurich?</p>
            </div>
            
            <div className="p-4 border border-[#457B9D] rounded-lg">
              <p className="font-semibold">What mechanisms could help reduce the translation of economic inequality into political inequality?</p>
            </div>
            
            <div className="p-4 border border-[#457B9D] rounded-lg">
              <p className="font-semibold">How might the experience of democracy differ for residents across different socioeconomic positions?</p>
            </div>
            
            <div className="p-4 border border-[#457B9D] rounded-lg">
              <p className="font-semibold">What responsibility do higher-income residents have in addressing systemic inequalities?</p>
            </div>
            
            <div className="p-4 border border-[#457B9D] rounded-lg">
              <p className="font-semibold">How can democratic systems better account for differential participation rates?</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            Explore Other Perspectives
          </h3>
          
          <p className="mb-6">
            You've explored Zurich's democratic systems through {persona.name}'s eyes. Now consider how the 
            experience might differ for residents in other socioeconomic positions:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/explore/anna" 
              className={`p-4 rounded-lg border-2 ${persona.id === 'anna' ? 'border-[#E63946] bg-[#F1FAEE]' : 'border-[#457B9D] hover:border-[#1D3557]'} transition-colors`}
            >
              <h4 className="font-semibold mb-2">Anna</h4>
              <p className="text-sm">Middle-income employee living in Zurich City</p>
            </Link>
            
            <Link 
              href="/explore/leo" 
              className={`p-4 rounded-lg border-2 ${persona.id === 'leo' ? 'border-[#E63946] bg-[#F1FAEE]' : 'border-[#457B9D] hover:border-[#1D3557]'} transition-colors`}
            >
              <h4 className="font-semibold mb-2">Leo</h4>
              <p className="text-sm">Lower-income service worker living in Schlieren</p>
            </Link>
            
            <Link 
              href="/explore/millionaire" 
              className={`p-4 rounded-lg border-2 ${persona.id === 'millionaire' ? 'border-[#E63946] bg-[#F1FAEE]' : 'border-[#457B9D] hover:border-[#1D3557]'} transition-colors`}
            >
              <h4 className="font-semibold mb-2">Thomas</h4>
              <p className="text-sm">High-income finance professional living in Küsnacht</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            About This Project
          </h3>
          
          <p className="mb-4">
            "Zurich Perspectives: Economy, Equity, and Influence" is an interactive web pilot exploring how 
            residents with different incomes experience taxation, benefit from public spending, and navigate 
            the political system in Zurich, Switzerland.
          </p>
          
          <p className="mb-4">
            This project aims to illustrate how economic inequality translates into political inequality 
            through multiple reinforcing mechanisms, creating a cycle that affects democratic participation 
            and representation.
          </p>
          
          <p>
            Data sources include the Federal Tax Administration (ESTV), Canton Zurich Finanzdirektion, 
            Swiss Federal Statistical Office, and academic research on political participation and representation.
          </p>
        </div>

        <div className="flex justify-between">
          <Link 
            href={`/explore/${persona.id}/engagement`}
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            ← Back to Voter Engagement
          </Link>
          <Link 
            href="/"
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
