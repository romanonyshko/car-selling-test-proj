import { DashboardIcon } from '@/components/icons/DashboardIcon'
import { DocumentsIcon } from '@/components/icons/DocumentsIcon'
import { PartsIcon } from '@/components/icons/PartsIcon'
import { WarrantyIcon } from '@/components/icons/WarrantyIcon'
import type { ComponentType } from 'react'

export interface NavItem {
  to: string
  label: string
  icon: ComponentType
  children?: { to: string; label: string }[]
}

export const navigation: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    icon: DashboardIcon,
    //need check this 
    children: [
      { to: '/', label: 'Home' },
      { to: '/dashboard/updates', label: 'Updates' },
      { to: '/dashboard/posts', label: 'Posts' },
      { to: '/dashboard/media', label: 'Media' },
    ],
  },
  {
    to: '/parts',
    label: 'Parts online',
    icon: PartsIcon,
    children: [
      { to: '/parts/catalogue', label: 'Catalogue' },
      { to: '/parts/in-stock', label: 'In stock' },
      { to: '/parts/orders', label: 'Orders' },
      { to: '/parts/price-list', label: 'Price list' },
    ],
  },
  { to: '/documents', label: 'Documents', icon: DocumentsIcon },
  { to: '/warranty-claims', label: 'Warranty claims', icon: WarrantyIcon },
]
