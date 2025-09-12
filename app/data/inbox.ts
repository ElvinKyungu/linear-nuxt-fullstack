import type { Notifications } from '@/types/inbox'
export const notifications: Notifications[] = [
  {
    id: 1,
    title: 'Refactor Button component for full accessibility compliance',
    description: "I've attached the new design mockup",
    time: '10h',
    isReaded: true,
    icon: 'uil:refresh',
    color: '#10b981',
    assignee: 'ELVIN-CODE-910'
  },
  {
    id: 2,
    title: 'Optimize animations for smoother UI transitions',
    description: 'Section renamed from Animations to UI Transitions',
    time: '4d',
    isReaded: true,
    icon: 'uil:play',
    color: '#ec4899',
    assignee: 'ELVIN-CODE-101'
  },
  {
    id: 3,
    title: 'Implement dark mode toggle with system preferences support',
    description: 'Reopened by GitHub',
    time: '6d',
    isReaded: false,
    icon: 'uil:moon',
    color: '#84cc16',
    assignee: 'ELVIN-CODE-671'
  },
  {
    id: 4,
    title: 'Design new modal system with focus trapping',
    description: 'https://github.com/ElvinKyungu/linear-nuxt-fullstack',
    time: '13d',
    isReaded: false,
    icon: 'uil:layer-group',
    color: '#8b5cf6',
    assignee: 'ELVIN-CODE-401'
  },
  {
    id: 5,
    title: 'Enhance responsiveness of Navbar',
    description: 'Tested on mobile and it works perfectly now',
    time: '11d',
    isReaded: true,
    icon: 'uil:mobile-android',
    color: '#10b981',
    assignee: 'ELVIN-CODE-001'
  },
  {
    id: 6,
    title: 'Optimize loading time of Footer',
    description: 'Updated performance metrics in the documentation',
    time: '18d',
    isReaded: true,
    icon: 'uil:rocket',
    color: '#10b981',
    assignee: 'ELVIN-CODE-910'
  },
  {
    id: 7,
    title: 'Refactor Sidebar for better accessibility',
    description: 'Closed by Linear',
    time: '4w',
    isReaded: false,
    icon: 'uil:sidebar',
    color: '#84cc16',
    assignee: 'ELVIN-CODE-401'
  },
  {
    id: 8,
    title: 'Implement new Card component design',
    description: 'Closed by Linear',
    time: '4w',
    isReaded: true,
    icon: 'uil:credit-card',
    color: '#84cc16',
    assignee: 'ELVIN-CODE-001'
  },
  {
    id: 9,
    title: 'Dashboard: adapt breadcrumb text in feature view',
    description: 'Reopened by GitHub',
    time: '6w',
    isReaded: false,
    icon: 'uil:dashboard',
    color: '#10b981',
    assignee: 'ELVIN-CODE-401'
  }
]
