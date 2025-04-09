'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Persona } from '@/types/persona';
import * as d3 from 'd3';

interface SpendingCategory {
  name: string;
  percentage: number;
  amount: number;
}

interface PersonaBenefit {
  category: string;
  benefit: string;
  description: string;
}

interface SpendingData {
  governmentSpending: {
    canton: {
      total: number;
      categories: SpendingCategory[];
    };
    federal: {
      total: number;
      categories: SpendingCategory[];
    };
    personaBenefits: {
      [key: string]: PersonaBenefit[];
    };
  };
}

export default function SpendingPage() {
  const params = useParams();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [spendingData, setSpendingData] = useState<SpendingData | null>(null);
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
        
        // Load spending data
        const spendingResponse = await fetch('/data/spending-data.json');
        const spendingData = await spendingResponse.json();
        setSpendingData(spendingData);
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.persona]);

  useEffect(() => {
    if (spendingData && persona) {
      renderCantonSpendingChart();
    }
  }, [spendingData, persona]);

  const renderCantonSpendingChart = () => {
    if (!spendingData || !persona) return;

    // Clear any existing chart
    d3.select('#canton-spending-chart').selectAll('*').remove();

    const width = 500;
    const height = 500;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select('#canton-spending-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(spendingData.governmentSpending.canton.categories.map(d => d.name))
      .range(d3.schemeCategory10);

    const pie = d3.pie<SpendingCategory>()
      .value(d => d.percentage);

    const data_ready = pie(spendingData.governmentSpending.canton.categories);

    const arcGenerator = d3.arc<d3.PieArcDatum<SpendingCategory>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Build the pie chart
    svg
      .selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', d => color(d.data.name) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    // Add labels
    svg
      .selectAll('slices')
      .data(data_ready)
      .enter()
      .append('text')
      .text(d => `${d.data.name}: ${d.data.percentage}%`)
      .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 12)
      .style('fill', 'white');
  };

  const getBenefitColor = (benefit: string) => {
    switch (benefit) {
      case 'very low':
        return 'bg-red-200';
      case 'low':
        return 'bg-orange-200';
      case 'medium':
        return 'bg-yellow-200';
      case 'high':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  const getBenefitWidth = (benefit: string) => {
    switch (benefit) {
      case 'very low':
        return '20%';
      case 'low':
        return '40%';
      case 'medium':
        return '60%';
      case 'high':
        return '80%';
      default:
        return '0%';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#1D3557]">Loading...</div>
      </div>
    );
  }

  if (!persona || !spendingData) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#E63946]">Error loading data</div>
      </div>
    );
  }

  const personaBenefits = spendingData.governmentSpending.personaBenefits[persona.id] || [];

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
              Government Spending
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
              This section explores how government spending in Zurich affects {persona.name}'s daily life. 
              With an annual tax contribution of approximately CHF {persona.id === 'anna' ? '12,800' : persona.id === 'leo' ? '5,900' : '180,000'}, 
              see how {persona.name} benefits from public services and how this compares to others across the socioeconomic spectrum.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              Canton Zurich Budget Breakdown
            </h3>
            
            <p className="mb-6">
              The Canton of Zurich has an annual budget of over CHF 18.5 billion, making it Switzerland's 
              second-largest public budget after the federal government. The chart below shows how this 
              budget is allocated across different categories.
            </p>
            
            <div id="canton-spending-chart" className="flex justify-center items-center h-96"></div>
            
            <p className="mt-4 text-sm text-gray-600">
              Data source: Canton Zurich Finanzdirektion
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              How {persona.name} Benefits from Public Spending
            </h3>
            
            <p className="mb-6">
              {persona.id === 'anna' 
                ? "As a middle-income resident, Anna benefits moderately from most public services, with particularly high usage of transportation infrastructure."
                : persona.id === 'leo' 
                  ? "As a lower-income resident, Leo benefits significantly from social welfare programs, healthcare subsidies, and public transportation."
                  : "As a high-income resident, Thomas benefits less directly from many public services, often opting for private alternatives when available."}
            </p>
            
            <div className="space-y-6">
              {personaBenefits.map((benefit, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{benefit.category}:</span>
                    <span className="capitalize">{benefit.benefit} benefit</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className={`${getBenefitColor(benefit.benefit)} h-2.5 rounded-full`} 
                      style={{ width: getBenefitWidth(benefit.benefit) }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            Tax Contribution vs. Benefits Analysis
          </h3>
          
          <div className="mb-6">
            <p className="mb-4">
              {persona.id === 'anna' 
                ? "Anna contributes approximately CHF 12,800 in taxes annually while receiving a moderate level of benefits from public services. Her tax-to-benefit ratio is relatively balanced, though she may not fully utilize all services her taxes support."
                : persona.id === 'leo' 
                  ? "Leo contributes approximately CHF 5,900 in taxes annually while receiving significant benefits from public services, particularly in healthcare and transportation. His tax-to-benefit ratio shows he receives more in services than he contributes in taxes."
                  : "Thomas contributes approximately CHF 180,000 in taxes annually while utilizing relatively few public services directly. His tax-to-benefit ratio shows he contributes significantly more than he directly receives in benefits."}
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Persona</th>
                    <th className="py-2 px-4 border-b text-right">Annual Tax</th>
                    <th className="py-2 px-4 border-b text-center">Education</th>
                    <th className="py-2 px-4 border-b text-center">Social Welfare</th>
                    <th className="py-2 px-4 border-b text-center">Healthcare</th>
                    <th className="py-2 px-4 border-b text-center">Transportation</th>
                    <th className="py-2 px-4 border-b text-right">Overall Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={persona.id === 'anna' ? "bg-[#F1FAEE]" : ""}>
                    <td className="py-2 px-4 border-b">Anna</td>
                    <td className="py-2 px-4 border-b text-right">CHF 12,800</td>
                    <td className="py-2 px-4 border-b text-center">Medium</td>
                    <td className="py-2 px-4 border-b text-center">Low</td>
                    <td className="py-2 px-4 border-b text-center">Medium</td>
                    <td className="py-2 px-4 border-b text-center">High</td>
                    <td className="py-2 px-4 border-b text-right">Medium</td>
                  </tr>
                  <tr className={persona.id === 'leo' ? "bg-[#F1FAEE]" : ""}>
                    <td className="py-2 px-4 border-b">Leo</td>
                    <td className="py-2 px-4 border-b text-right">CHF 5,900</td>
                    <td className="py-2 px-4 border-b text-center">Low</td>
                    <td className="py-2 px-4 border-b text-center">Medium</td>
                    <td className="py-2 px-4 border-b text-center">High</td>
                    <td className="py-2 px-4 border-b text-center">High</td>
                    <td className="py-2 px-4 border-b text-right">High</td>
                  </tr>
                  <tr className={persona.id === 'millionaire' ? "bg-[#F1FAEE]" : ""}>
                    <td className="py-2 px-4 border-b">Thomas</td>
                    <td className="py-2 px-4 border-b text-right">CHF 180,000</td>
                    <td className="py-2 px-4 border-b text-center">Low</td>
                    <td className="py-2 px-4 border-b text-center">Very Low</td>
                    <td className="py-2 px-4 border-b text-center">Low</td>
                    <td className="py-2 px-4 border-b text-center">Medium</td>
                    <td className="py-2 px-4 border-b text-right">Low</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Key Insights:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Progressive Benefit Structure:</strong> While taxation in Switzerland has regressive elements, 
                the benefit structure is progressive, with lower-income residents receiving more direct benefits relative 
                to their tax contributions.
              </li>
              <li>
                <strong>Indirect Benefits:</strong> Higher-income residents like Thomas benefit indirectly from public 
                spending through overall societal stability, well-educated workforce, and infrastructure that supports 
                business activities.
              </li>
              <li>
                <strong>Service Utilization Patterns:</strong> Income level significantly affects which public services 
                residents utilize, with higher-income residents often opting for private alternatives in education and healthcare.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between">
          <Link 
            href={`/explore/${persona.id}/taxation`}
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            ← Back to Taxation
          </Link>
          <Link 
            href={`/explore/${persona.id}/influence`}
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            Continue to Political Influence →
          </Link>
        </div>
      </div>
    </main>
  );
}
