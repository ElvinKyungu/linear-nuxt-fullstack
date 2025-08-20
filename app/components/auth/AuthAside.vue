<template>
  <div
    class="hidden md:flex w-1/2 flex-col justify-center items-center text-white p-12 relative"
    :style="{
      backgroundImage:
        'url(https://images.unsplash.com/photo-1517196084897-498e0abd7c2d?q=80&w=687&auto=format&fit=crop)',
      backgroundSize: 'cover',
    }"
  >
    <div class="absolute inset-0 bg-black/30" />
    <div class="relative z-10 space-y-6 max-w-xs">
      <div class="bg-white/20 backdrop-blur-md p-4 rounded-xl">
        <div class="text-sm font-medium">Engagement</div>
        <div class="text-lg font-semibold">+46%</div>
      </div>

      <div class="bg-white text-gray-900 p-4 rounded-xl">
        <p class="text-sm">
          “Project-Hub UI is surprisingly handy for keeping all my business
          stuff in one place”
        </p>
        <div class="mt-2 flex items-center space-x-2">
          <UAvatar src="/images/gab.jpg" />
          <div>
            <div class="text-xs font-semibold">Gabriel Delattre</div>
            <div class="text-xs text-gray-500">VP Engineer</div>
          </div>
        </div>
      </div>

      <div class="bg-white/20 backdrop-blur-md p-4 rounded-xl">
        <div class="text-sm font-medium">Growth</div>
        <div class="text-lg font-semibold">+23%</div>
      </div>
    </div>
  </div>
</template>
