<template>
  <div
            class="border-b border-bordercolor shrink-0 sticky top-0 bg-primary z-20"
          >
            <div class="min-w-full">
              <div class="grid grid-cols-12 gap-4 px-6 py-3">
                <!-- Responsive columns -->
                <div
                  class="col-span-6 flex justify-start w-full items-start sm:col-span-6 lg:col-span-6 xl:col-span-6"
                >
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Title
                  </span>
                </div>
                <div
                  class="hidden md:block md:col-span-3 lg:col-span-1 xl:col-span-1"
                >
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Health
                  </span>
                </div>
                <div class="hidden lg:block lg:col-span-1 xl:col-span-1">
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Priority
                  </span>
                </div>
                <div
                  class="flex justify-end w-full items-end col-span-6 sm:col-span-6 lg:col-span-1 xl:col-span-1"
                >
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Lead
                  </span>
                </div>
                <div class="hidden xl:block lg:col-span-1 xl:col-span-1">
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Target date
                  </span>
                </div>
                <div class="hidden xl:block lg:col-span-1 xl:col-span-1">
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </span>
                </div>
              </div>
            </div>
          </div>
</template>