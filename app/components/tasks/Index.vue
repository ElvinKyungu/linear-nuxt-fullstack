<template>
  <div class="task-management-app h-screen flex flex-col overflow-hidden">
    <header
      class="flex justify-between items-center p-4 border-b border-bordercolor text-white flex-shrink-0"
    >
      <div class="flex items-center gap-4">
        <UButton
          class="flex gap-3 cursor-pointer items-center"
          variant="ghost"
        >
          <UIcon name="uil:filter" class="text-2xl" />
          <span class="text-base">Filter</span>
        </UButton>
      </div>
      <div class="flex gap-3 items-center relative">
        <UButton
          ref="displayTriggerElement"
          class="flex gap-1a cursor-pointer items-center"
          variant="ghost"
        >
          <UIcon name="uil:sliders-v" class="text-xl" />
          <span class="text-base">Display</span>
        </UButton>
       
      </div>
    </header>
  </div>
</template>

<style scoped>
/* Styles pour la scrollbar dans les colonnes */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Styles pour la scrollbar horizontale */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Styles optimisés pour le drag and drop */
.ghost-task {
  opacity: 0.5;
  background: rgba(79, 70, 229, 0.2);
  border: 2px dashed #4f46e5;
  border-radius: 8px;
}

.chosen-task {
  cursor: grabbing !important;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  transition: all 0.2s ease;
}

.drag-task {
  cursor: grabbing !important;
  opacity: 0.9;
}

/* Améliorer la zone de grab */
.cursor-move {
  cursor: grab;
}

.cursor-move:active {
  cursor: grabbing;
}

/* Assurer une hauteur minimale pour les zones de drop */
.min-h-[50px] {
  min-height: 50px;
}

.min-h-[200px] {
  min-height: 200px;
}

/* Animation fluide pour les transitions */
.sortable-ghost {
  background: rgba(79, 70, 229, 0.1) !important;
  border: 2px dashed #4f46e5 !important;
  border-radius: 8px !important;
}

/* Styles pour rendre le drag plus réactif */
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Permettre la sélection du texte dans les inputs */
input,
textarea {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
</style>
