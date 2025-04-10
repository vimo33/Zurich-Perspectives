"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  persona?: string // Optional, only set when a persona is selected
}

const personas = [
  { id: "anna", name: "Anna" },
  { id: "leo", name: "Leo" },
  { id: "millionaire", name: "Thomas" } // Updated id to match personas.json
]

const subPages = [
  { id: "taxation", name: "Taxation" },
  { id: "spending", name: "Public Spending" },
  { id: "influence", name: "Political Influence" },
  { id: "engagement", name: "Voter Engagement" },
  { id: "synthesis", name: "Synthesis" } // Removed Reflection page
]

export default function Header({ persona }: HeaderProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Main Header */}
      <header className="bg-[#1D3557] text-white py-4 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Zurich Perspectives Logo */}
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            <Link href="/">Zurich Perspectives</Link>
          </h1>

          {/* Main Menu */}
          <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Personas */}
            {personas.map((p) => (
              <Link
                key={p.id}
                href={`/explore/${p.id}`} // Ensure the link matches the persona id
                className={`hover:underline ${
                  pathname.includes(`/explore/${p.id}`) ? "font-bold" : ""
                }`}
              >
                {p.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Secondary Menu (Only visible when a persona is selected) */}
      {persona && (
        <div className="bg-[#A8DADC] text-[#1D3557] py-2">
          <div className="container mx-auto flex flex-wrap justify-center space-x-4 md:space-x-6">
            {subPages.map((page) => (
              <Link
                key={page.id}
                href={`/explore/${persona}/${page.id}`}
                className={`hover:underline ${
                  pathname.includes(`/${page.id}`) ? "font-bold underline" : ""
                }`}
              >
                {page.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
