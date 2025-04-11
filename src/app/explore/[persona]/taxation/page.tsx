"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import { Persona } from "@/types/persona"

interface TaxBracket {
  lowerBound: number
  upperBound: number
  rate: number
}

interface TaxData {
  taxRates: {
    federal: TaxBracket[]
    cantonal: {
      baseRate: number
      multipliers: { municipality: string; multiplier: number }[]
    }
    municipal: {
      [key: string]: number
    }
  }
  deductions: {
    standard: number
    professionalExpenses: number
    maxProfessionalExpenses: number
    healthInsurance: number
    thirdPillar: number
  }
}

export default function TaxationPage() {
  const params = useParams()
  const persona = Array.isArray(params.persona)
    ? params.persona[0]
    : params.persona // Ensure persona is a string

  const [personaData, setPersonaData] = useState<Persona | null>(null)
  const [taxData, setTaxData] = useState<TaxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [taxBreakdown, setTaxBreakdown] = useState<{
    federal: number
    cantonal: number
    municipal: number
    total: number
    effectiveRate: number
  } | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Load persona data
        const personaResponse = await fetch("/data/personas.json")
        const personaData = await personaResponse.json()
        const foundPersona = personaData.personas.find(
          (p: Persona) => p.id === persona
        )

        if (foundPersona) {
          setPersonaData(foundPersona)
        }

        // Load tax data
        const taxResponse = await fetch("/data/tax-data.json")
        const taxData = await taxResponse.json()
        setTaxData(taxData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [persona])

  const calculateTax = useCallback(() => {
    if (!personaData || !taxData) return

    // Calculate taxable income after deductions
    const professionalExpenses = Math.min(
      personaData.income * taxData.deductions.professionalExpenses,
      taxData.deductions.maxProfessionalExpenses
    )

    // Assuming the persona contributes to third pillar if income > 80000
    const thirdPillarDeduction =
      personaData.income > 80000 ? taxData.deductions.thirdPillar : 0

    const totalDeductions =
      taxData.deductions.standard +
      professionalExpenses +
      taxData.deductions.healthInsurance +
      thirdPillarDeduction

    const taxableIncome = Math.max(0, personaData.income - totalDeductions)

    // Calculate federal tax
    let federalTax = 0
    for (const bracket of taxData.taxRates.federal) {
      if (taxableIncome > bracket.lowerBound) {
        const amountInBracket = Math.min(
          taxableIncome - bracket.lowerBound,
          bracket.upperBound - bracket.lowerBound
        )
        federalTax += (amountInBracket * bracket.rate) / 100
      }
    }

    // Calculate cantonal tax (simplified as a percentage of federal tax)
    const cantonalTax = federalTax * (taxData.taxRates.cantonal.baseRate / 100)

    // Calculate municipal tax
    const municipalMultiplier =
      taxData.taxRates.municipal[personaData.municipality] || 100
    const municipalTax = cantonalTax * (municipalMultiplier / 100)

    // Calculate total tax and effective rate
    const totalTax = federalTax + cantonalTax + municipalTax
    const effectiveRate = (totalTax / personaData.income) * 100

    setTaxBreakdown({
      federal: Math.round(federalTax),
      cantonal: Math.round(cantonalTax),
      municipal: Math.round(municipalTax),
      total: Math.round(totalTax),
      effectiveRate: Math.round(effectiveRate * 10) / 10
    })
  }, [personaData, taxData])

  useEffect(() => {
    if (personaData && taxData) {
      calculateTax()
    }
  }, [personaData, taxData, calculateTax])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#1D3557]">Loading...</div>
      </div>
    )
  }

  if (!personaData || !taxData || !taxBreakdown) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#E63946]">Error loading data</div>
      </div>
    )
  }

  return (
    <>
      <Header persona={persona} />
      <main className="min-h-screen bg-[#F1FAEE] text-[#333333]">
        <div className="container mx-auto px-4 py-12">
          <header className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <Link
                href={`/explore/${personaData.id}`}
                className="text-[#1D3557] hover:underline"
              >
                ← Back to {personaData.name}&apos;s Profile
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
                  <span className="text-2xl font-light">
                    {personaData.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{personaData.name}</h2>
                  <p className="text-[#457B9D]">{personaData.occupation}</p>
                </div>
              </div>

              <p className="mb-8">
                This section explores how {personaData.name} experiences
                taxation in Zurich. With an annual income of CHF{" "}
                {personaData.income.toLocaleString()}, living in{" "}
                {personaData.municipality}
                (tax multiplier: {personaData.taxMultiplier}%), see how{" "}
                {personaData.name}&apos;s tax burden compares to others across
                the socioeconomic spectrum.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
                {personaData.name}&apos;s Tax Breakdown
              </h3>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Annual Income:</span>
                  <span className="font-semibold">
                    CHF {personaData.income.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Municipality:</span>
                  <span className="font-semibold">
                    {personaData.municipality} ({personaData.taxMultiplier}%)
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Total Tax:</span>
                  <span className="font-semibold">
                    CHF {taxBreakdown.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Effective Tax Rate:</span>
                  <span className="font-semibold">
                    {taxBreakdown.effectiveRate}%
                  </span>
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
                      style={{
                        width: `${
                          (taxBreakdown.federal / taxBreakdown.total) * 100
                        }%`
                      }}
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
                      style={{
                        width: `${
                          (taxBreakdown.cantonal / taxBreakdown.total) * 100
                        }%`
                      }}
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
                      style={{
                        width: `${
                          (taxBreakdown.municipal / taxBreakdown.total) * 100
                        }%`
                      }}
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
                {personaData.name}&apos;s effective tax rate of{" "}
                {taxBreakdown.effectiveRate}% means that
                {taxBreakdown.effectiveRate > 15
                  ? " a significant portion"
                  : taxBreakdown.effectiveRate > 10
                  ? " a moderate portion"
                  : " a relatively small portion"}
                of income goes to taxes.
                {personaData.id === "millionaire"
                  ? " Despite having a much higher income, the effective tax rate benefits from the low tax multiplier in Küsnacht (73%), showing how wealthy residents can optimize their tax situation by living in low-tax municipalities."
                  : personaData.id === "anna"
                  ? " Living in Zurich City means paying a higher municipal tax multiplier (119%) compared to wealthy suburbs, creating a proportionally higher tax burden for middle-income residents."
                  : " Despite having a lower income, the tax burden is still significant relative to disposable income, and living in Schlieren provides only a modest tax advantage compared to Zurich City."}
              </p>

              <h4 className="font-semibold mb-3">Key Insights:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  {personaData.id === "millionaire"
                    ? "Wealthy residents benefit significantly from Switzerland's regressive tax system and can choose to live in low-tax municipalities."
                    : personaData.id === "anna"
                    ? "Middle-income residents bear a proportionally higher tax burden compared to the wealthiest residents."
                    : "Lower-income residents have less flexibility to optimize their tax situation through relocation."}
                </li>
                <li>
                  Municipal tax multipliers create significant differences in
                  tax burden based on location, with wealthy municipalities
                  often having the lowest rates.
                </li>
                <li>
                  {personaData.id === "millionaire"
                    ? "Access to tax optimization strategies (like third pillar contributions) provides additional advantages to high-income residents."
                    : personaData.id === "anna"
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
                    <th className="py-2 px-4 border-b text-right">
                      Municipality
                    </th>
                    <th className="py-2 px-4 border-b text-right">
                      Tax Multiplier
                    </th>
                    <th className="py-2 px-4 border-b text-right">Total Tax</th>
                    <th className="py-2 px-4 border-b text-right">
                      Effective Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className={personaData.id === "anna" ? "bg-[#F1FAEE]" : ""}
                  >
                    <td className="py-2 px-4 border-b">Anna</td>
                    <td className="py-2 px-4 border-b text-right">
                      CHF 85,000
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      Zurich City
                    </td>
                    <td className="py-2 px-4 border-b text-right">119%</td>
                    <td className="py-2 px-4 border-b text-right">
                      {personaData.id === "anna"
                        ? `CHF ${taxBreakdown.total.toLocaleString()}`
                        : "CHF 12,800"}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {personaData.id === "anna"
                        ? `${taxBreakdown.effectiveRate}%`
                        : "15.1%"}
                    </td>
                  </tr>
                  <tr
                    className={personaData.id === "leo" ? "bg-[#F1FAEE]" : ""}
                  >
                    <td className="py-2 px-4 border-b">Leo</td>
                    <td className="py-2 px-4 border-b text-right">
                      CHF 55,000
                    </td>
                    <td className="py-2 px-4 border-b text-right">Schlieren</td>
                    <td className="py-2 px-4 border-b text-right">111%</td>
                    <td className="py-2 px-4 border-b text-right">
                      {personaData.id === "leo"
                        ? `CHF ${taxBreakdown.total.toLocaleString()}`
                        : "CHF 5,900"}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {personaData.id === "leo"
                        ? `${taxBreakdown.effectiveRate}%`
                        : "10.7%"}
                    </td>
                  </tr>
                  <tr
                    className={
                      personaData.id === "millionaire" ? "bg-[#F1FAEE]" : ""
                    }
                  >
                    <td className="py-2 px-4 border-b">Thomas</td>
                    <td className="py-2 px-4 border-b text-right">
                      CHF 750,000
                    </td>
                    <td className="py-2 px-4 border-b text-right">Küsnacht</td>
                    <td className="py-2 px-4 border-b text-right">73%</td>
                    <td className="py-2 px-4 border-b text-right">
                      {personaData.id === "millionaire"
                        ? `CHF ${taxBreakdown.total.toLocaleString()}`
                        : "CHF 180,000"}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {personaData.id === "millionaire"
                        ? `${taxBreakdown.effectiveRate}%`
                        : "24.0%"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <p className="mb-4">
                <strong>Key Observation:</strong> While the absolute tax amount
                increases with income, the difference in tax multipliers between
                municipalities creates significant disparities. Wealthy
                residents in Küsnacht benefit from a tax multiplier (73%) that
                is nearly 40% lower than in Zurich City (119%), despite having
                much higher incomes.
              </p>
              <p>
                This system creates a situation where middle-income residents
                like Anna bear a proportionally higher tax burden compared to
                their disposable income, while wealthy residents can optimize
                their tax situation by living in low-tax municipalities.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Link
              href={`/explore/${personaData.id}`}
              className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
            >
              Back to Profile
            </Link>
            <Link
              href={`/explore/${personaData.id}/spending`}
              className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
            >
              Continue to Public Spending →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
