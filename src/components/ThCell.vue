<template>
  <th
    :class="classes"
    ref="thRef"
    :style="freezeOffset"
  >
    <slot></slot>
    <label class="freeze-column">
      🧊
      <input
        type="checkbox"
        v-model="props.freeze"
        @change="emitFreeze($event)"/>
    </label>
    <span class="resize-handle" @mousedown="emitResize($event)" />
  </th>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, useSlots } from "vue";
import { ALIGNS, TYPES } from "./datatable.types";

export interface CellProps {
  id: number,
  freeze: boolean,
  type: string,
  align: string
}

const thRef = ref(null);

onMounted(() => {})

const props = withDefaults(defineProps<CellProps>(), {
  freeze: false,
  type: TYPES.TEXT_SHORT,
  align: ALIGNS.LEFT,
})

const emits = defineEmits({
  'freeze' (payload) {
    return !!(payload.ref);
  },
  'resize' (payload) {
    return !!payload.ref;
  }
})

const classes = computed(() => {
  return {
    'cell': true,
    [`align-${props.align}`]: Boolean(props.align),
    'freeze': Boolean(props.freeze),
  }
})

const freezeOffset = computed(() => {
  if (props.freeze && thRef.value) {
    return `left: ${thRef.value.offsetLeft}px`
  }
})

const emitFreeze = (event: Event) => {
  emits('freeze', {
    id: props.id,
    freeze: !props.freeze
  });
}

const emitResize = (event: Event) => {
  emits('resize', {
    ref: thRef.value
  });
}
</script>

<style scoped lang="scss">
th {
  position: sticky;
  top: 0;
  background: mediumpurple;
  color: white;
  &:hover .resize-handle {
    opacity: 0.7;
  }
}

.freeze-column {
  margin-left: 1em;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: black;
  opacity: 0.2;
  width: 3px;
  cursor: col-resize;
}
</style>

