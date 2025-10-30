<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui'

const items = ref<ContextMenuItem[][]>([
  [
    {
      label: 'Appearance',
      children: [
        {
          label: 'System',
          icon: 'i-lucide-monitor'
        },
        {
          label: 'Light',
          icon: 'i-lucide-sun'
        },
        {
          label: 'Dark',
          icon: 'i-lucide-moon'
        }
      ]
    }
  ],
  [
    {
      label: 'Show Sidebar',
      kbds: ['meta', 's']
    },
    {
      label: 'Show Toolbar',
      kbds: ['shift', 'meta', 'd']
    },
    {
      label: 'Collapse Pinned Tabs',
      disabled: true
    }
  ],
  [
    {
      label: 'Refresh the Page'
    },
    {
      label: 'Clear Cookies and Refresh'
    },
    {
      label: 'Clear Cache and Refresh'
    },
    {
      type: 'separator'
    },
    {
      label: 'Developer',
      children: [
        [
          {
            label: 'View Source',
            kbds: ['meta', 'shift', 'u']
          },
          {
            label: 'Developer Tools',
            kbds: ['option', 'meta', 'i']
          },
          {
            label: 'Inspect Elements',
            kbds: ['option', 'meta', 'c']
          }
        ],
        [
          {
            label: 'JavaScript Console',
            kbds: ['option', 'meta', 'j']
          }
        ]
      ]
    }
  ]
])
</script>

<template>
  <NuxtLayout>
    <UContextMenu
      :items="items"
      :ui="{
        content: 'w-48 bg-background text-white border-none ring-bordercolor border-bordercolor rounded-md overflow-hidden',
        viewport: 'relative divide-y divide-bordercolor overflow-y-auto',
        separator: '-mx-2 my-2 h-px bg-bordercolor',
        item: 'group relative w-full flex items-center p-2 text-sm select-none text-white hover:bg-white/50',
         itemContent: 'w-full flex items-center hover:text-white',
         itemKbd: 'ml-auto text-xs font-medium bg-bordercolor/30 rounded px-1.5 py-0.5 text-white',
         itemSubmenuIndicator: 'ml-auto text-white',
        label: 'w-full flex items-center font-semibold text-white px-2 py-1',
         itemLeadingIcon: 'shrink-0 text-white',
      }"
    >
      <Tasks />
    </UContextMenu>
  </NuxtLayout>
</template>
