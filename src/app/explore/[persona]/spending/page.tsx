"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"

interface SpendingCategory {
  name: string
  percentage: number
  amount: number
}

interface PersonaBenefit {
  category: string
  description: string
}

interface SpendingData {
  governmentSpending: {
    canton: {
      categories?: SpendingCategory[]
    }
    federal: {
      categories?: SpendingCategory[]
    }
    personaBenefits: {
      [key: string]: PersonaBenefit[] | undefined
    }
  }
}

export default function SpendingPage() {
  const params = useParams()
  const persona = Array.isArray(params.persona)
    ? params.persona[0]
    : params.persona // Ensure persona is a string

  const [spendingData, setSpendingData] = useState<SpendingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSpendingData() {
      try {
        const response = await fetch("/data/spending-data.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: SpendingData = await response.json()
        setSpendingData(data)
      } catch (error) {
        console.error("Error loading spending data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSpendingData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-2xl text-[#1D3557]">Loading...</div>
      </div>
    )
  }

  if (!spendingData) {
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
                href={`/explore/${persona}`}
                className="text-[#1D3557] hover:underline"
              >
                ← Back to {persona}&apos;s Profile
              </Link>
              <h2 className="text-2xl font-semibold text-[#457B9D]">
                Zurich Perspectives
              </h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-[#1D3557] mb-6">
                Public Spending
              </h1>
              <p>
                Explore how tax money is allocated and how {persona} benefits
                from public spending in Zurich. Learn about spending categories
                and the public services most relevant to {persona}.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Canton Spending Categories */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
                Canton Spending Categories
              </h3>
              <ul>
                {spendingData.governmentSpending.canton.categories &&
                spendingData.governmentSpending.canton.categories.length > 0 ? (
                  spendingData.governmentSpending.canton.categories.map(
                    (category, index) => (
                      <li key={index} className="mb-2">
                        <strong>{category.name}:</strong> {category.percentage}%
                        ({category.amount.toLocaleString()} CHF)
                      </li>
                    )
                  )
                ) : (
                  <p>No canton spending data available.</p>
                )}
              </ul>
            </div>

            {/* Persona Benefits */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#1D3557] mb-4">
                Public Services Used by {persona}
              </h3>
              <ul>
                {persona &&
                spendingData.governmentSpending.personaBenefits &&
                (spendingData.governmentSpending.personaBenefits[persona] ?? [])
                  .length > 0 ? (
                  spendingData.governmentSpending.personaBenefits[persona]!.map(
                    (benefit: PersonaBenefit, index: number) => (
                      <li key={index} className="mb-2">
                        <strong>{benefit.category}:</strong>{" "}
                        {benefit.description}
                      </li>
                    )
                  )
                ) : (
                  <p>No data available for {persona || "this persona"}.</p>
                )}
              </ul>
            </div>
          </div>

          <div className="flex justify-between">
            <Link
              href={`/explore/${persona}/taxation`}
              className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
            >
              ← Back to Taxation
            </Link>
            <Link
              href={`/explore/${persona}/influence`}
              className="py-2 px-4 bg-[#1D3557] text-white rounded hover:bg-[#2a4a76] transition-colors"
            >
              Continue to Political Influence →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
