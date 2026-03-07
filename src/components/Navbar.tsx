'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Stethoscope, Briefcase, Building2, Globe, ClipboardList, CheckSquare, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: Stethoscope },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/hospitals', label: 'Hospitals', icon: Building2 },
  { href: '/portals', label: 'Portals', icon: Globe },
  { href: '/tracker', label: 'Tracker', icon: ClipboardList },
  { href: '/checklist', label: 'Checklist', icon: CheckSquare },
  { href: '/admin', label: 'Admin', icon: Settings },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white/85 backdrop-blur-md border-b border-gray-100/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-400/20 rounded-xl blur-sm group-hover:bg-primary-400/35 transition-all duration-300" />
                <div className="relative p-1.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-sm">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold text-gray-900 leading-tight">ENT Job Portal</span>
                <span className="text-xs text-primary-500 font-medium block -mt-0.5">Dr. Tanvi Maurya</span>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-700 bg-primary-50/80'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary-500' : ''}`} />
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-gradient-to-r from-primary-500 to-sky-400 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100/80 bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-primary-100' : 'bg-gray-100'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
