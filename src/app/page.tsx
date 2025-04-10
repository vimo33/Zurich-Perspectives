import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F1FAEE] text-[#333333]">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1D3557] mb-4">
            ZURICH PERSPECTIVES
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#457B9D] mb-8">
            Economy, Equity, and Influence
          </h2>
          <p className="max-w-3xl mx-auto text-lg mb-8">
            Explore how Zurich residents with different incomes experience
            taxation, benefit from public spending, and navigate the political
            system. Choose a persona below to begin your journey.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Anna Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-[#457B9D] relative">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span className="text-6xl font-light">Anna</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Middle-Class Employee</h3>
              <p className="text-gray-700 mb-4">
                Office administrator living in Zurich City, earning CHF 85,000
                annually. Educated and politically aware but time-constrained.
              </p>
              <Link
                href="/explore/anna"
                className="block w-full py-2 px-4 bg-[#1D3557] text-white text-center rounded hover:bg-[#2a4a76] transition-colors"
              >
                SELECT ANNA
              </Link>
            </div>
          </div>

          {/* Leo Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-[#457B9D] relative">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span className="text-6xl font-light">Leo</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">
                Lower-Income Service Worker
              </h3>
              <p className="text-gray-700 mb-4">
                Hospitality worker living in Schlieren, earning CHF 55,000
                annually. Works multiple jobs with limited time for political
                engagement.
              </p>
              <Link
                href="/explore/leo"
                className="block w-full py-2 px-4 bg-[#1D3557] text-white text-center rounded hover:bg-[#2a4a76] transition-colors"
              >
                SELECT LEO
              </Link>
            </div>
          </div>

          {/* Millionaire Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-[#457B9D] relative">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span className="text-6xl font-light">Thomas</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Finance Executive</h3>
              <p className="text-gray-700 mb-4">
                Finance executive living in Küsnacht, earning CHF 750,000
                annually. Well-connected, politically active and influential.
              </p>
              <Link
                href="/explore/millionaire"
                className="block w-full py-2 px-4 bg-[#1D3557] text-white text-center rounded hover:bg-[#2a4a76] transition-colors"
              >
                SELECT THOMAS
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-[#1D3557] mb-4">
            About This Project
          </h3>
          <p className="text-lg mb-4">
            This interactive web pilot explores how economic inequality
            translates into political inequality in Zurich, Switzerland. By
            following the experiences of three personas with different
            socioeconomic backgrounds, you&apos;ll discover how taxation, public
            spending, political influence, and voter engagement vary across
            income levels.
          </p>
          <p className="text-lg">
            The data presented is based on research from official sources
            including the Federal Tax Administration, Canton Zurich statistics,
            and academic studies on political participation and influence.
          </p>
        </div>
      </div>
    </main>
  )
}
