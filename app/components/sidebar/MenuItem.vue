<script setup>
import { useLayout } from '@/composables/useLayouts'

const { layoutState, setActiveMenuItem, onMenuToggle } = useLayout()

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
})

const isActiveMenu = ref(false)
const itemKey = ref(null)

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + '-' + props.index
    : String(props.index)

  const activeItem = layoutState.activeMenuItem

  isActiveMenu.value =
    activeItem === itemKey.value || activeItem
      ? activeItem.startsWith(itemKey.value + '-')
      : false
})

watch(
  () => layoutState.activeMenuItem,
  (newVal) => {
    isActiveMenu.value =
      newVal === itemKey.value || newVal.startsWith(itemKey.value + '-')
  }
)

function itemClick(event, item) {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (
    (item.to || item.url) &&
    (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)
  ) {
    onMenuToggle()
  }

  if (item.command) {
    item.command({ originalEvent: event, item: item })
  }

  const foundItemKey = item.items
    ? isActiveMenu.value
      ? props.parentItemKey
      : itemKey
    : itemKey.value

  setActiveMenuItem(foundItemKey)
}

function checkActiveRoute(item) {
  return route.path === item.to
}
</script>

<template>
  <li
    :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }"
  >
    <div
      v-if="root && item.visible !== false"
      class="layout-menuitem-root-text"
    >
      {{ item.label }}
    </div>
    <a
      v-if="(!item.to || item.items) && item.visible !== false"
      :href="item.url"
      :class="item.class"
      :target="item.target"
      tabindex="0"
      @click="itemClick($event, item, index)"
    >
      <i :class="item.icon" class="layout-menuitem-icon" />
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i
        v-if="item.items"
        class="pi pi-fw pi-angle-down layout-submenu-toggler"
      />
    </a>
    <router-link
      v-if="item.to && !item.items && item.visible !== false"
      :class="[item.class, { 'active-route': checkActiveRoute(item) }]"
      tabindex="0"
      :to="item.to"
      @click="itemClick($event, item, index)"
    >
      <i :class="item.icon" class="layout-menuitem-icon" />
      <span class="layout-menuitem-text mt-1">{{ item.label }}</span>
      <i
        v-if="item.items"
        class="pi pi-fw pi-angle-down layout-submenu-toggler"
      />
    </router-link>
  </li>
</template>

<style lang="scss" scoped></style>
