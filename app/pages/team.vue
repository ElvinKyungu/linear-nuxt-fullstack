<script setup lang="ts">
interface Team {
  name: string
  membership: boolean
  identifier: string
  members: string[]
  projects: number
}

const teams = ref<Team[]>([
  { name: 'LNDev Core', membership: true, identifier: 'CORE', members: ['👩‍💻','👨‍💻','🧑‍💻','+2'], projects: 3 },
  { name: 'Design System', membership: true, identifier: 'DESIGN', members: ['👩‍🎨','👨‍🎨'], projects: 4 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  { name: 'Performance Lab', membership: false, identifier: 'PERF', members: ['🟢','🟢','🔴','+4'], projects: 2 },
  // ... ajoute le reste des équipes
])
</script>

<template>
  <NuxtLayout>
    <div class="overflow-hidden">
      <!-- Table Header fixe -->
      <div class="bg-primary fixed w-full">
        <table class="min-w-full">
          <thead class="text-left">
            <tr>
              <th class="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Name</th>
              <th class="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Membership</th>
              <th class="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Identifier</th>
              <th class="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Members</th>
              <th class="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Projects</th>
              <th class="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Action</th>
            </tr>
          </thead>
        </table>
      </div>

      <!-- Table Body scrollable -->
      <div class=" overflow-y-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody class="">
            <tr v-for="team in teams" :key="team.identifier" class="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ team.name }}</td>
              <td class="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">
                <span v-if="team.membership" class="text-green-500 font-semibold">Joined</span>
                <span v-else class="text-gray-400 font-semibold">—</span>
              </td>
              <td class="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">{{ team.identifier }}</td>
              <td class="px-6 py-3 text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                <span v-for="member in team.members" :key="member">{{ member }}</span>
              </td>
              <td class="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">{{ team.projects }}</td>
              <td class="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">
                <UButton size="sm" color="primary" variant="outline">
                  <NuxtIcon name="uil:edit" class="w-4 h-4 mr-1" /> Edit
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
thead th {
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 10;
}
</style>
