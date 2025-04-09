'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Persona } from '@/types/persona';
import * as d3 from 'd3';

interface TurnoutByGroup {
  level?: string;
  group?: string;
  turnout: number;
}

interface ParticipationBarrier {
  barrier: string;
  impact: number;
  description: string;
}

interface PolicyAlignment {
  incomeGroup: string;
  alignment: number;
  description: string;
}

interface EngagementData {
  voterEngagement: {
    turnoutRates: {
      zurich: {
        nationalCouncil2023: number;
        federalAverage: number;
        byEducation: TurnoutByGroup[];
        byIncome: TurnoutByGroup[];
        byAge: TurnoutByGroup[];
      };
    };
    participationBarriers: {
      [key: string]: ParticipationBarrier[];
    };
    representationEffects: {
      policyAlignment: PolicyAlignment[];
      keyFindings: string[];
    };
  };
}

export default function EngagementPage() {
  const params = useParams();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
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
        
        // Load engagement data
        const engagementResponse = await fetch('/data/engagement-data.json');
        const engagementData = await engagementResponse.json();
        setEngagementData(engagementData);
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.persona]);

  useEffect(() => {
    if (engagementData && persona) {
      renderTurnoutByEducationChart();
      renderTurnoutByIncomeChart();
      renderPolicyAlignmentChart();
    }
  }, [engagementData, persona]);

  const renderTurnoutByEducationChart = () => {
    if (!engagementData) return;

    // Clear any existing chart
    d3.select('#turnout-education-chart').selectAll('*').remove();

    const data = engagementData.voterEngagement.turnoutRates.zurich.byEducation;
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select('#turnout-education-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.level || ''))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .nice()
      .range([innerHeight, 0]);

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.level || '') || 0)
      .attr('y', d => y(d.turnout))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.turnout))
      .attr('fill', '#457B9D');

    // Add labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.level || '') || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.turnout) - 5)
      .attr('text-anchor', 'middle')
      .text(d => `${d.turnout}%`)
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
      .text('Voter Turnout by Education Level');
  };

  const renderTurnoutByIncomeChart = () => {
    if (!engagementData) return;

    // Clear any existing chart
    d3.select('#turnout-income-chart').selectAll('*').remove();

    const data = engagementData.voterEngagement.turnoutRates.zurich.byIncome;
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select('#turnout-income-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.group || ''))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .nice()
      .range([innerHeight, 0]);

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.group || '') || 0)
      .attr('y', d => y(d.turnout))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.turnout))
      .attr('fill', (d, i) => {
        if (i === 0 && persona?.id === 'leo') return '#E63946';
        if (i === 1 && persona?.id === 'anna') return '#E63946';
        if (i === 2 && persona?.id === 'millionaire') return '#E63946';
        return '#457B9D';
      });

    // Add labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.group || '') || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.turnout) - 5)
      .attr('text-anchor', 'middle')
      .text(d => `${d.turnout}%`)
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
      .text('Voter Turnout by Income Level');
  };

  const renderPolicyAlignmentChart = () => {
    if (!engagementData) return;

    // Clear any existing chart
    d3.select('#policy-alignment-chart').selectAll('*').remove();

    const data = engagementData.voterEngagement.representationEffects.policyAlignment;
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select('#policy-alignment-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.incomeGroup))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .nice()
      .range([innerHeight, 0]);

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.incomeGroup) || 0)
      .attr('y', d => y(d.alignment))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.alignment))
      .attr('fill', (d, i) => {
        if (i === 0 && persona?.id === 'leo') return '#E63946';
        if (i === 1 && persona?.id === 'anna') return '#E63946';
        if (i === 2 && persona?.id === 'millionaire') return '#E63946';
        return '#1D3557';
      });

    // Add labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.incomeGroup) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.alignment) - 5)
      .attr('text-anchor', 'middle')
      .text(d => `${d.alignment}%`)
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
      .text('Policy Alignment with Voter Preferences');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#1D3557]">Loading...</div>
      </div>
    );
  }

  if (!persona || !engagementData) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#E63946]">Error loading data</div>
      </div>
    );
  }

  const personaBarriers = engagementData.voterEngagement.participationBarriers[persona.id] || [];

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
              Voter Engagement
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
              This section explores how voter participation varies across different socioeconomic groups in Zurich.
              See how factors like education, income, and age affect democratic participation, and understand
              the barriers that {persona.name} might face when engaging with the political system.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              Voter Turnout by Education Level
            </h3>
            
            <p className="mb-6">
              Education level is one of the strongest predictors of voter participation. In Zurich, 
              those with tertiary education are more than twice as likely to vote as those with only 
              primary education.
            </p>
            
            <div id="turnout-education-chart" className="flex justify-center items-center h-80"></div>
            
            <p className="mt-4 text-sm text-gray-600">
              Data source: Swiss Federal Statistical Office, Selects Survey
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
              Voter Turnout by Income Level
            </h3>
            
            <p className="mb-6">
              Income level strongly correlates with voter participation. High-income residents in Zurich 
              are twice as likely to vote as low-income residents, creating a significant representation gap.
              {persona.id === 'anna' 
                ? " As a middle-income resident, Anna falls in the middle range of voter participation."
                : persona.id === 'leo' 
                  ? " As a lower-income resident, Leo is in the demographic group with the lowest voter participation rates."
                  : " As a high-income resident, Thomas is in the demographic group with the highest voter participation rates."}
            </p>
            
            <div id="turnout-income-chart" className="flex justify-center items-center h-80"></div>
            
            <p className="mt-4 text-sm text-gray-600">
              Data source: Swiss Federal Statistical Office, Selects Survey
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            {persona.name}'s Participation Barriers
          </h3>
          
          <p className="mb-6">
            {persona.id === 'anna' 
              ? "As a middle-income resident with a full-time job, Anna faces moderate barriers to political participation, primarily related to time constraints."
              : persona.id === 'leo' 
                ? "As a lower-income resident working multiple jobs, Leo faces significant barriers to political participation, including severe time constraints and limited access to political information."
                : "As a high-income resident with a flexible schedule and extensive networks, Thomas faces few barriers to political participation."}
          </p>
          
          <div className="space-y-4 mb-6">
            {personaBarriers.map((barrier, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{barrier.barrier}:</span>
                  <span>Impact: {barrier.impact}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-[#E63946] h-2.5 rounded-full" 
                    style={{ width: `${barrier.impact * 10}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{barrier.description}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-[#F1FAEE] rounded-lg">
            <h4 className="font-semibold mb-2">Participation Patterns:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {persona.id === 'anna' ? (
                <>
                  <li><strong>Federal Elections:</strong> Votes in most federal elections</li>
                  <li><strong>Cantonal Elections:</strong> Votes in some cantonal elections</li>
                  <li><strong>Referendums:</strong> Participates in approximately half of referendums</li>
                  <li><strong>Local Politics:</strong> Limited engagement with local political issues</li>
                </>
              ) : persona.id === 'leo' ? (
                <>
                  <li><strong>Federal Elections:</strong> Votes occasionally in major federal elections</li>
                  <li><strong>Cantonal Elections:</strong> Rarely votes in cantonal elections</li>
                  <li><strong>Referendums:</strong> Participates in few referendums</li>
                  <li><strong>Local Politics:</strong> Minimal engagement with local political issues</li>
                </>
              ) : (
                <>
                  <li><strong>Federal Elections:</strong> Votes consistently in federal elections</li>
                  <li><strong>Cantonal Elections:</strong> Votes regularly in cantonal elections</li>
                  <li><strong>Referendums:</strong> Participates in most referendums</li>
                  <li><strong>Local Politics:</strong> Active engagement with local political issues</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
            Representation Effects
          </h3>
          
          <p className="mb-6">
            Differential turnout by socioeconomic status creates a "participation gap" that skews democratic 
            representation. Research shows that policies tend to align more closely with the preferences of 
            higher-income voters who participate at higher rates.
          </p>
          
          <div id="policy-alignment-chart" className="flex justify-center items-center h-80 mb-6"></div>
          
          <div className="p-4 bg-[#F1FAEE] rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Key Research Findings:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {engagementData.voterEngagement.representationEffects.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 border border-[#1D3557] rounded-lg">
            <h4 className="font-semibold mb-2">What This Means for {persona.name}:</h4>
            <p>
              {persona.id === 'anna' 
                ? "As a middle-income resident with moderate political participation, Anna's preferences are somewhat represented in policy outcomes, but not as strongly as those of higher-income voters. The policies that affect her daily life may not fully align with her interests."
                : persona.id === 'leo' 
                  ? "As a lower-income resident with limited political participation, Leo's preferences are significantly underrepresented in policy outcomes. The political system is less responsive to his needs and interests compared to higher-income voters."
                  : "As a high-income resident with high political participation, Thomas's preferences are strongly represented in policy outcomes. The political system is highly responsive to his needs and interests."}
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <Link 
            href={`/explore/${persona.id}/influence`}
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            ← Back to Political Influence
          </Link>
          <Link 
            href={`/explore/${persona.id}/synthesis`}
            className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
          >
            Continue to Synthesis →
          </Link>
        </div>
      </div>
    </main>
  );
}
