"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/Header"

interface WealthDistribution {
  group: string
  wealthShare: number
}

interface WealthInfluence {
  wealthDistribution: {
    switzerland: WealthDistribution[]
    cantonChanges?: WealthDistribution[]
  }
  politicalAccess?: Record<string, { description: string }>
  campaignFinancing?: {
    examples: { donor: string; amount: number; recipient: string }[]
  }
  lobbyingMechanisms?: { mechanism: string; description: string }[]
}

interface InfluenceData {
  wealthInfluence: WealthInfluence
}

export default function InfluencePage() {
  const params = useParams()
  const persona = Array.isArray(params.persona)
    ? params.persona[0]
    : params.persona // Ensure persona is a string
  const [influenceData, setInfluenceData] = useState<InfluenceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInfluenceData() {
      try {
        const response = await fetch("/data/influence-data.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: InfluenceData = await response.json()
        setInfluenceData(data)
      } catch (error) {
        console.error("Error loading influence data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInfluenceData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#1D3557]">Loading...</div>
      </div>
    )
  }

  if (!influenceData) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#E63946]">
          Error: Unable to load data
        </div>
      </div>
    )
  }

  return (
    <>
      <Header persona={persona || "unknown"} />
      <main className="min-h-screen bg-[#F1FAEE] text-[#333333]">
        <div className="container mx-auto px-4 py-12">
          {/* White Box Container */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#1D3557] mb-6">
              Political Influence for {persona || "Unknown Persona"}
            </h1>

            {/* Wealth Distribution Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#457B9D] mb-4">
                Wealth Distribution in Switzerland
              </h2>
              {influenceData.wealthInfluence.wealthDistribution.switzerland
                .length > 0 ? (
                <ul className="list-disc pl-5">
                  {influenceData.wealthInfluence.wealthDistribution.switzerland.map(
                    (group, index) => (
                      <li key={index} className="mb-2">
                        <strong>{group.group}:</strong> {group.wealthShare}%
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No wealth distribution data available.</p>
              )}
            </div>

            {/* Political Access Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#457B9D] mb-4">
                Political Access
              </h2>
              <p>
                {influenceData.wealthInfluence.politicalAccess &&
                persona &&
                influenceData.wealthInfluence.politicalAccess[persona]
                  ?.description
                  ? influenceData.wealthInfluence.politicalAccess[persona]
                      .description
                  : "No political access data available."}
              </p>
            </div>

            {/* Campaign Financing Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#457B9D] mb-4">
                Campaign Financing
              </h2>
              {influenceData.wealthInfluence.campaignFinancing?.examples &&
              influenceData.wealthInfluence.campaignFinancing.examples.length >
                0 ? (
                <ul className="list-disc pl-5">
                  {influenceData.wealthInfluence.campaignFinancing.examples.map(
                    (example, index) => (
                      <li key={index} className="mb-2">
                        <strong>{example.donor}:</strong> {example.amount} CHF
                        to {example.recipient}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No campaign financing data available.</p>
              )}
            </div>

            {/* Lobbying Mechanisms Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#457B9D] mb-4">
                Lobbying Mechanisms
              </h2>
              {influenceData.wealthInfluence.lobbyingMechanisms?.length ??
              0 > 0 ? (
                <ul className="list-disc pl-5">
                  {influenceData.wealthInfluence.lobbyingMechanisms?.map(
                    (mechanism, index) => (
                      <li key={index} className="mb-2">
                        <strong>
                          {mechanism.mechanism || "Unknown Mechanism"}:
                        </strong>{" "}
                        {mechanism.description || "No description available"}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No lobbying mechanisms data available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
