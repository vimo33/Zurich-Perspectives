'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Persona } from '@/types/persona';

interface TaxBracket {
  lowerBound: number;
  upperBound: number;
  rate: number;
}

interface TaxData {
  taxRates: {
    federal: TaxBracket[];
    cantonal: {
      baseRate: number;
    };
    municipal: {
      [key: string]: number;
    };
  };
  deductions: {
    standard: number;
    professionalExpenses: number;
    maxProfessionalExpenses: number;
    healthInsurance: number;
    thirdPillar: number;
  };
}

export default function TaxationPage() {
  const params = useParams();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [taxData, setTaxData] = useState<TaxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [taxBreakdown, setTaxBreakdown] = useState<{
    federal: number;
    cantonal: number;
    municipal: number;
    total: number;
    effectiveRate: number;
  } | null>(null);

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
        
        // Load tax data
        const taxResponse = await fetch('/data/tax-data.json');
        const taxData = await taxResponse.json();
        setTaxData(taxData);
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.persona]);

  useEffect(() => {
    if (persona && taxData) {
      calculateTax();
    }
  }, [persona, taxData]);

  const calculateTax = () => {
    if (!persona || !taxData) return;

    // Calculate taxable income after deductions
    const professionalExpenses = Math.min(
      persona.income * taxData.deductions.professionalExpenses,
      taxData.deductions.maxProfessionalExpenses
    );
    
    // Assuming the persona contributes to third pillar if income > 80000
    const thirdPillarDeduction = persona.income > 80000 ? taxData.deductions.thirdPillar : 0;
    
    const totalDeductions = 
      taxData.deductions.standard + 
      professionalExpenses + 
      taxData.deductions.healthInsurance +
      thirdPillarDeduction;
    
    const taxableIncome = Math.max(0, persona.income - totalDeductions);
    
    // Calculate federal tax
    let federalTax = 0;
    for (const bracket of taxData.taxRates.federal) {
      if (taxableIncome > bracket.lowerBound) {
        const amountInBracket = Math.min(
          taxableIncome - bracket.lowerBound,
          bracket.upperBound - bracket.lowerBound
        );
        federalTax += (amountInBracket * bracket.rate) / 100;
      }
    }
    
    // Calculate cantonal tax (simplified as a percentage of federal tax)
    // In reality, cantons have their own tax brackets, but for this demo we'll use a simplified approach
    const cantonalTax = federalTax * (taxData.taxRates.cantonal.baseRate / 100);
    
    // Calculate municipal tax
    const municipalMultiplier = taxData.taxRates.municipal[persona.municipality] || 100;
    const municipalTax = cantonalTax * (municipalMultiplier / 100);
    
    // Calculate total tax and effective rate
    const totalTax = federalTax + cantonalTax + municipalTax;
    const effectiveRate = (totalTax / persona.income) * 100;
    
    setTaxBreakdown({
      federal: Math.round(federalTax),
      cantonal: Math.round(cantonalTax),
      municipal: Math.round(municipalTax),
      total: Math.round(totalTax),
      effectiveRate: Math.round(effectiveRate * 10) / 10
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#1D3557]">Loading...</div>
      </div>
    );
  }

  if (!persona || !taxData || !taxBreakdown) {
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
              Taxation & Income Inequality
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
              This section explores how {persona.name} experiences taxation in Zurich. 
              With an annual income of CHF {persona.income.toLocaleString()}, living in {persona.municipality} 
              (tax multiplier: {persona.taxMultiplier}%), see how {persona.name}'s tax burden compares 
              to others across the socioeconomic spectrum.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              {persona.name}'s Tax Breakdown
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Annual Income:</span>
                <span className="font-semibold">CHF {persona.income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Municipality:</span>
                <span className="font-semibold">{persona.municipality} ({persona.taxMultiplier}%)</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Total Tax:</span>
                <span className="font-semibold">CHF {taxBreakdown.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Effective Tax Rate:</span>
                <span className="font-semibold">{taxBreakdown.effectiveRate}%</span>
              </div>
            </div>
            
            <h4 className="font-semibold mb-3">Tax Components:</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Federal Tax:</span>
                  <span>CHF {taxBreakdown.federal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#1D3557] h-2.5 rounded-full" 
                    style={{ width: `${(taxBreakdown.federal / taxBreakdown.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Cantonal Tax:</span>
                  <span>CHF {taxBreakdown.cantonal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#457B9D] h-2.5 rounded-full" 
                    style={{ width: `${(taxBreakdown.cantonal / taxBreakdown.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Municipal Tax:</span>
                  <span>CHF {taxBreakdown.municipal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#A8DADC] h-2.5 rounded-full" 
                    style={{ width: `${(taxBreakdown.municipal / taxBreakdown.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              Tax Burden Analysis
            </h3>
            
            <p className="mb-6">
              {persona.name}'s effective tax rate of {taxBreakdown.effectiveRate}% means that 
              {taxBreakdown.effectiveRate > 15 
                ? " a significant portion" 
                : taxBreakdown.effectiveRate > 10 
                  ? " a moderate portion" 
                  : " a relatively small portion"} 
              of income goes to taxes. 
              
              {persona.id === 'millionaire' 
                ? " Despite having a much higher income, the effective tax rate benefits from the low tax multiplier in Küsnacht (73%), showing how wealthy residents can optimize their tax situation by living in low-tax municipalities."
                : persona.id === 'anna' 
                  ? " Living in Zurich City means paying a higher municipal tax multiplier (119%) compared to wealthy suburbs, creating a proportionally higher tax burden for middle-income residents."
                  : " Despite having a lower income, the tax burden is still significant relative to disposable income, and living in Schlieren provides only a modest tax advantage compared to Zurich City."}
            </p>
            
            <h4 className="font-semibold mb-3">Key Insights:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {persona.id === 'millionaire' 
                  ? "Wealthy residents benefit significantly from Switzerland's regressive tax system and can choose to live in low-tax municipalities."
                  : persona.id === 'anna' 
                    ? "Middle-income residents bear a proportionally higher tax burden compared to the wealthiest residents."
                    : "Lower-income residents have less flexibility to optimize their tax situation through relocation."}
              </li>
              <li>
                Municipal tax multipliers create significant differences in tax burden based on location, with wealthy municipalities often having the lowest rates.
              </li>
              <li>
                {persona.id === 'millionaire' 
                  ? "Access to tax optimization strategies (like third pillar contributions) provides additional advantages to high-income residents."
                  : persona.id === 'anna' 
                    ? "While able to benefit from some tax deductions like third pillar contributions, the overall tax burden remains significant."
                    : "Limited ability to take advantage of tax deductions due to lower income."}
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            Compare Tax Burden Across Personas
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Persona</th>
                  <th className="py-2 px-4 border-b text-right">Income</th>
                  <th className="py-2 px-4 border-b text-right">Municipality</th>
                  <th className="py-2 px-4 border-b text-right">Tax Multiplier</th>
                  <th className="py-2 px-4 border-b text-right">Total Tax</th>
                  <th className="py-2 px-4 border-b text-right">Effective Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className={persona.id === 'anna' ? "bg-[#F1FAEE]" : ""}>
                  <td className="py-2 px-4 border-b">Anna</td>
                  <td className="py-2 px-4 border-b text-right">CHF 85,000</td>
                  <td className="py-2 px-4 border-b text-right">Zurich City</td>
                  <td className="py-2 px-4 border-b text-right">119%</td>
                  <td className="py-2 px-4 border-b text-right">
                    {persona.id === 'anna' 
                      ? `CHF ${taxBreakdown.total.toLocaleString()}`
                      : "CHF 12,800"}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    {persona.id === 'anna' 
                      ? `${taxBreakdown.effectiveRate}%`
                      : "15.1%"}
                  </td>
                </tr>
                <tr className={persona.id === 'leo' ? "bg-[#F1FAEE]" : ""}>
                  <td className="py-2 px-4 border-b">Leo</td>
                  <td className="py-2 px-4 border-b text-right">CHF 55,000</td>
                  <td className="py-2 px-4 border-b text-right">Schlieren</td>
                  <td className="py-2 px-4 border-b text-right">111%</td>
                  <td className="py-2 px-4 border-b text-right">
                    {persona.id === 'leo' 
                      ? `CHF ${taxBreakdown.total.toLocaleString()}`
                      : "CHF 5,900"}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    {persona.id === 'leo' 
                      ? `${taxBreakdown.effectiveRate}%`
                      : "10.7%"}
                  </td>
                </tr>
                <tr className={persona.id === 'millionaire' ? "bg-[#F1FAEE]" : ""}>
                  <td className="py-2 px-4 border-b">Thomas</td>
                  <td className="py-2 px-4 border-b text-right">CHF 750,000</td>
                  <td className="py-2 px-4 border-b text-right">Küsnacht</td>
                  <td className="py-2 px-4 border-b text-right">73%</td>
                  <td className="py-2 px-4 border-b text-right">
                    {persona.id === 'millionaire' 
                      ? `CHF ${taxBreakdown.total.toLocaleString()}`
                      : "CHF 180,000"}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    {persona.id === 'millionaire' 
                      ? `${taxBreakdown.effectiveRate}%`
                      : "24.0%"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <p className="mb-4">
              <strong>Key Observation:</strong> While the absolute tax amount increases with income, 
              the difference in tax multipliers between municipalities creates significant disparities. 
              Wealthy residents in Küsnacht benefit from a tax multiplier (73%) that is nearly 40% lower 
              than in Zurich City (119%), despite having much higher incomes.
            </p>
            <p>
              This system creates a situation where middle-income residents like Anna bear a proportionally 
              higher tax burden compared to their disposable income, while wealthy residents can optimize 
              their tax situation by living in low-tax municipalities.
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <Link 
            href={`/explore/${persona.id}`}
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            Back to Profile
          </Link>
          <Link 
            href={`/explore/${persona.id}/spending`}
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            Continue to Public Spending →
          </Link>
        </div>
      </div>
    </main>
  );
}
