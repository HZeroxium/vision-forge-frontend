'use client'
import dynamic from 'next/dynamic'

// Dynamic import of TopNav with ssr: false
const TopNav = dynamic(() => import('@/components/navigation/TopNav'), {
  ssr: false,
})

export default function ClientTopNav() {
  return <TopNav />
}
