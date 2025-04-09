'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Persona } from '@/types/persona';
import * as d3 from 'd3';

interface WealthDistribution {
  group: string;
  wealthShare: number;
}

interface CantonChange {
  canton: string;
  change: number;
  description: string;
}

interface PoliticalAccess {
  directAccess: number;
  indirectAccess: number;
  description: string;
}

interface CampaignExample {
  donor: string;
  amount: number;
  recipient: string;
}

interface ZurichCampaign {
  candidate: string;
  budget: number;
  description: string;
}

interface LobbyingMechanism {
  mechanism: string;
  effectiveness: number;
  description: string;
}

interface InfluenceData {
  wealthInfluence: {
    wealthDistribution: {
      switzerland: WealthDistribution[];
      cantonChanges: CantonChange[];
    };
    politicalAccess: {
      [key: string]: PoliticalAccess;
    };
    campaignFinancing: {
      transparency: string;
      examples: CampaignExample[];
      zurichCampaigns: ZurichCampaign[];
    };
    lobbyingMechanisms: LobbyingMechanism[];
  };
}

export default function InfluencePage() {
  const params = useParams();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [influenceData, setInfluenceData] = useState<InfluenceData | null>(null);
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
        
        // Load influence data
        const influenceResponse = await fetch('/data/influence-data.json');
        const influenceData = await influenceResponse.json();
        setInfluenceData(influenceData);
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.persona]);

  useEffect(() => {
    if (influenceData && persona) {
      renderWealthDistributionChart();
      renderPoliticalAccessChart();
    }
  }, [influenceData, persona]);

  const renderWealthDistributionChart = () => {
    if (!influenceData) return;

    // Clear any existing chart
    d3.select('#wealth-distribution-chart').selectAll('*').remove();

    const data = influenceData.wealthInfluence.wealthDistribution.switzerland;
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select('#wealth-distribution-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.group))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.wealthShare) || 50])
      .nice()
      .range([innerHeight, 0]);

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.group) || 0)
      .attr('y', d => y(d.wealthShare))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.wealthShare))
      .attr('fill', d => {
        if (d.group === 'Top 1%') return '#E63946';
        if (d.group === 'Next 9%') return '#457B9D';
        if (d.group === 'Middle 40%') return '#A8DADC';
        return '#F1FAEE';
      });

    // Add labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.group) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.wealthShare) - 5)
      .attr('text-anchor', 'middle')
      .text(d => `${d.wealthShare}%`)
      .attr('fill', '#333333')
      .attr('font-size', '12px');

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`));

    // Add title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Wealth Distribution in Switzerland');
  };

  const renderPoliticalAccessChart = () => {
    if (!influenceData || !persona) return;

    // Clear any existing chart
    d3.select('#political-access-chart').selectAll('*').remove();

    const width = 500;
    const height = 200;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select('#political-access-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create data for all personas
    const data = [
      {
        name: 'Anna',
        directAccess: influenceData.wealthInfluence.politicalAccess.anna.directAccess,
        indirectAccess: influenceData.wealthInfluence.politicalAccess.anna.indirectAccess
      },
      {
        name: 'Leo',
        directAccess: influenceData.wealthInfluence.politicalAccess.leo.directAccess,
        indirectAccess: influenceData.wealthInfluence.politicalAccess.leo.indirectAccess
      },
      {
        name: 'Thomas',
        directAccess: influenceData.wealthInfluence.politicalAccess.millionaire.directAccess,
        indirectAccess: influenceData.wealthInfluence.politicalAccess.millionaire.indirectAccess
      }
    ];

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, 10])
      .nice()
      .range([innerHeight, 0]);

    // Add bars for direct access
    svg.selectAll('.bar-direct')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-direct')
      .attr('x', d => (x(d.name) || 0) + x.bandwidth() * 0.1)
      .attr('y', d => y(d.directAccess))
      .attr('width', x.bandwidth() * 0.35)
      .attr('height', d => innerHeight - y(d.directAccess))
      .attr('fill', '#1D3557')
      .attr('opacity', d => d.name === persona.name ? 1 : 0.5);

    // Add bars for indirect access
    svg.selectAll('.bar-indirect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-indirect')
      .attr('x', d => (x(d.name) || 0) + x.bandwidth() * 0.55)
      .attr('y', d => y(d.indirectAccess))
      .attr('width', x.bandwidth() * 0.35)
      .attr('height', d => innerHeight - y(d.indirectAccess))
      .attr('fill', '#457B9D')
      .attr('opacity', d => d.name === persona.name ? 1 : 0.5);

    // Add labels
    svg.selectAll('.label-direct')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label-direct')
      .attr('x', d => (x(d.name) || 0) + x.bandwidth() * 0.275)
      .attr('y', d => y(d.directAccess) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.directAccess)
      .attr('fill', '#333333')
      .attr('font-size', '10px')
      .attr('opacity', d => d.name === persona.name ? 1 : 0.5);

    svg.selectAll('.label-indirect')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label-indirect')
      .attr('x', d => (x(d.name) || 0) + x.bandwidth() * 0.725)
      .attr('y', d => y(d.indirectAccess) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.indirectAccess)
      .attr('fill', '#333333')
      .attr('font-size', '10px')
      .attr('opacity', d => d.name === persona.name ? 1 : 0.5);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5));

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${innerWidth - 100}, 0)`);

    legend.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#1D3557');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text('Direct Access')
      .attr('font-size', '10px');

    legend.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('y', 20)
      .attr('fill', '#457B9D');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 32)
      .text('Indirect Access')
      .attr('font-size', '10px');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#1D3557]">Loading...</div>
      </div>
    );
  }

  if (!persona || !influenceData) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#E63946]">Error loading data</div>
      </div>
    );
  }

  const personaAccess = influenceData.wealthInfluence.politicalAccess[persona.id];

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
              Wealth & Political Influence
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
              This section explores how wealth translates into political influence in Zurich and Switzerland.
              See how {persona.name}'s economic position affects access to political decision-makers and
              ability to influence policy outcomes compared to others across the socioeconomic spectrum.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              Wealth Distribution in Switzerland
            </h3>
            
            <p className="mb-6">
              Switzerland has one of the highest wealth concentrations globally. The richest 1% own 43% of total wealth,
              while the bottom 50% own just 2.3%. This extreme concentration of economic resources translates into
              significant differences in political influence.
            </p>
            
            <div id="wealth-distribution-chart" className="flex justify-center items-center h-80"></div>
            
            <p className="mt-4 text-sm text-gray-600">
              Data source: Swiss National Bank, Credit Suisse Global Wealth Report
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              {persona.name}'s Political Access
            </h3>
            
            <p className="mb-6">
              {persona.id === 'anna' 
                ? "As a middle-income resident, Anna has limited direct access to politicians and moderate indirect access through professional associations."
                : persona.id === 'leo' 
                  ? "As a lower-income resident, Leo has very limited direct access to politicians and minimal indirect access through unions or community organizations."
                  : "As a high-income resident, Thomas has significant direct access to politicians through business networks and strong indirect access through industry associations."}
            </p>
            
            <div id="political-access-chart" className="flex justify-center items-center h-52 mb-4"></div>
            
            <p className="mb-4">
              <strong>Direct Access:</strong> {personaAccess.directAccess}/10 - Personal contact with elected officials, participation in exclusive events with politicians
            </p>
            <p>
              <strong>Indirect Access:</strong> {personaAccess.indirectAccess}/10 - Influence through associations, unions, or lobbying groups that represent interests
            </p>
            
            <p className="mt-4 italic">
              "{personaAccess.description}"
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            Campaign Financing & Political Donations
          </h3>
          
          <p className="mb-6">
            Switzerland has historically had very limited transparency in political financing. New rules implemented in 2021
            still contain significant loopholes. Wealthy individuals and organizations can donate large sums to political
            campaigns with limited public disclosure.
          </p>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Donor</th>
                  <th className="py-2 px-4 border-b text-right">Amount (CHF)</th>
                  <th className="py-2 px-4 border-b text-left">Recipient</th>
                </tr>
              </thead>
              <tbody>
                {influenceData.wealthInfluence.campaignFinancing.examples.map((example, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{example.donor}</td>
                    <td className="py-2 px-4 border-b text-right">{example.amount.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{example.recipient}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <h4 className="font-semibold mb-3">Zurich Campaign Budgets:</h4>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            {influenceData.wealthInfluence.campaignFinancing.zurichCampaigns.map((campaign, index) => (
              <li key={index}>
                <strong>{campaign.candidate}:</strong> CHF {campaign.budget.toLocaleString()} - {campaign.description}
              </li>
            ))}
          </ul>
          
          <div className="p-4 bg-[#F1FAEE] rounded-lg">
            <h4 className="font-semibold mb-2">What This Means for {persona.name}:</h4>
            <p>
              {persona.id === 'anna' 
                ? "With limited disposable income, Anna cannot make significant political donations. Her ability to financially support candidates or causes she believes in is restricted, reducing her political influence compared to wealthier residents."
                : persona.id === 'leo' 
                  ? "Leo has virtually no capacity to make political donations. His financial constraints mean he cannot contribute to campaigns or causes, severely limiting his ability to influence the political process through financial means."
                  : "Thomas has substantial capacity to make political donations. He can financially support candidates and causes aligned with his interests, giving him significant influence over the political process compared to lower-income residents."}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            Lobbying & Influence Mechanisms
          </h3>
          
          <p className="mb-6">
            Beyond campaign financing, there are multiple mechanisms through which wealth translates into political influence.
            These mechanisms are more accessible to higher-income residents and organizations representing their interests.
          </p>
          
          <div className="space-y-4 mb-6">
            {influenceData.wealthInfluence.lobbyingMechanisms.map((mechanism, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{mechanism.mechanism}:</span>
                  <span>Effectiveness: {mechanism.effectiveness}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-[#1D3557] h-2.5 rounded-full" 
                    style={{ width: `${mechanism.effectiveness * 10}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{mechanism.description}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-[#F1FAEE] rounded-lg">
            <h4 className="font-semibold mb-2">{persona.name}'s Access to Influence Mechanisms:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {persona.id === 'anna' ? (
                <>
                  <li><strong>Industry Associations:</strong> Limited access through professional organizations</li>
                  <li><strong>Direct Politician Contact:</strong> Very limited</li>
                  <li><strong>Media Influence:</strong> None</li>
                  <li><strong>Expert Committees:</strong> None</li>
                  <li><strong>Public Campaigns:</strong> Limited participation as a voter</li>
                </>
              ) : persona.id === 'leo' ? (
                <>
                  <li><strong>Industry Associations:</strong> Minimal access through unions</li>
                  <li><strong>Direct Politician Contact:</strong> None</li>
                  <li><strong>Media Influence:</strong> None</li>
                  <li><strong>Expert Committees:</strong> None</li>
                  <li><strong>Public Campaigns:</strong> Limited participation as a voter</li>
                </>
              ) : (
                <>
                  <li><strong>Industry Associations:</strong> Strong access through business and finance associations</li>
                  <li><strong>Direct Politician Contact:</strong> Regular access through business and social networks</li>
                  <li><strong>Media Influence:</strong> Some influence through business connections</li>
                  <li><strong>Expert Committees:</strong> Potential participation based on professional status</li>
                  <li><strong>Public Campaigns:</strong> Ability to fund campaigns aligned with interests</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-between">
          <Link 
            href={`/explore/${persona.id}/spending`}
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            ← Back to Public Spending
          </Link>
          <Link 
            href={`/explore/${persona.id}/engagement`}
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            Continue to Voter Engagement →
          </Link>
        </div>
      </div>
    </main>
  );
}
