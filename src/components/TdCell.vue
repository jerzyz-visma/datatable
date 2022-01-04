<template>
  <td
    :class="classes"
    ref="tdRef"
    :style="freezeOffset"
  >
    <slot></slot>
  </td>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, useSlots } from "vue";
import { ALIGNS, TYPES } from "./datatable.types";

interface CellProps {
  freeze: boolean,
  type: string,
  align: string
}

const tdRef = ref(null);

const props = withDefaults(defineProps<CellProps>(), {
  isHeader: false,
  freeze: false,
  type: TYPES.TEXT_SHORT,
  align: ALIGNS.LEFT
})

const classes = computed(() => {
  return {
    'cell': true,
    [`align-${props.align}`]: Boolean(props.align),
    'freeze': Boolean(props.freeze),
  }
})

const freezeOffset = computed(() => {
  if (props.freeze && tdRef.value) {
    return `left: ${tdRef.value.offsetLeft}px`
  }
})

onMounted(() => {})
</script>
