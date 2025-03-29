import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@store/store'
import { toast } from 'react-hot-toast'

interface SidebarLinkProps {
  href: string
  icon?: React.ReactNode
  text: string
  isProtected?: boolean
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  href, 
  icon, 
  text, 
  isProtected = true 
}) => {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (isProtected && !user) {
      e.preventDefault()
      toast.error('Please log in to access this feature')
      router.push('/auth/login')
    }
  }

  return (
    <li>
      <Link 
        href={href} 
        className="flex items-center p-2 rounded hover:bg-gray-700"
        onClick={handleClick}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{text}</span>
      </Link>
    </li>
  )
}

export default SidebarLink
