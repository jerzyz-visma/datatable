<template>
  <div>
    <table ref="tableRef">
      <thead>
      <tr>
        <ThCell
          v-for="(col, colIndex) in cols"
          :key="col.id"
          :id="col.id"
          :type="col.type"
          :freeze="col.freeze"
          :align="col.align"
          @freeze="freezeColumn"
          @resize="initResize"
        >
          {{ col.title }}
        </ThCell>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rowIndex) in rows">
        <TdCell
          v-for="(col, colIndex) in cols"
          :key="colIndex"
          :id="col.id"
          :type="col.type"
          :freeze="col.freeze"
          :align="col.align"
        >{{ col.value }}</TdCell>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
import ThCell from "../components/ThCell.vue";
import TdCell from "../components/TdCell.vue";

const min = 120;
const columnTypeToRatioMap: Record<string, number> = {
  "numeric": 1,
  "text-short": 1.67,
  "text-long": 3.33,
}

interface Columns {
  id: number,
  title: string,
  value: string,
  type: string,
  freeze?: boolean,
  align?: string
}

interface IColumnSize {
  th: HTMLElement,
  size: string
}

const rows = ref([1,2,3,4,5])
const cols = ref<Columns[]>([
  { id: 0, title: 'First name', value: 'John', type: 'text-short', align: 'left', freeze: true },
  { id: 1, title: 'Last name', value: 'Johnson', type: 'text-short', align: 'left', freeze: false},
  { id: 2, title: 'Email', value: 'john@johnson.com', type: 'text-short', align: 'left', freeze: false },
  { id: 3, title: 'Address', value: '7850 Old Shore Drive', type: 'text-long', align: 'right', freeze: false },
  { id: 4, title: 'Balance', value: '2000', type: 'numeric', align: 'center', freeze: false },
])

const thRefs = ref();
const tableRef = ref();
const resizedHeader = ref();
const columns = ref<IColumnSize[] | null>();
const colAmount = ref();

onMounted(() => {
  console.log('onMounted')
  thRefs.value = tableRef.value.querySelectorAll('th')

  columns.value = cols.value.map((col: Columns, index) => (
    {
      th: thRefs.value[index],
      size: `minmax(${min}px, ${columnTypeToRatioMap[col.type] + 'fr'})`
    }
  ))
  colAmount.value = columns.value.length
})

const freezeColumn = (col: Columns) => {
  cols.value[col.id].freeze = !cols.value[col.id].freeze;
}

const initResize = (event: { ref: object}) => {
  resizedHeader.value = event.ref;
  resizedHeader.value.classList.add('header-resized');

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

const onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  resizedHeader.value.classList.remove('header-resized');
  resizedHeader.value = null;
}

const onMouseMove = (e: MouseEvent) => requestAnimationFrame(() => {
  // Calculate the desired width
  const horizontalScrollOffset = document.documentElement.scrollLeft;
  const width = (horizontalScrollOffset + e.clientX) - resizedHeader.value.offsetLeft;

  // Update the column object with the new size value
  const resizedColumn = columns.value!.find(({ th }) => th === resizedHeader.value);
  resizedColumn!.size = Math.max(min, width) + 'px';

  // For other th which don't have a set width, fix it to their computed width
  columns.value!.forEach((column: IColumnSize) => {
    if (column.size.startsWith('minmax')) {
      // isn't fixed yet it would be a pixel value otherwise
      column.size = `${column.th.clientWidth}px`;
    }
  })

  const tableWidth = tableRef.value.offsetWidth;
  const colsWidthSum = [...thRefs.value]
    .reduce((accumulator: number, a: HTMLElement) => accumulator + a.offsetWidth, 0);

  if (colsWidthSum < tableWidth) {
    const lastColumnSize = columns.value![colAmount.value-1].size;
    const availableSpace = tableWidth - colsWidthSum - 2;

    columns.value![colAmount.value-1].size = `${parseInt(lastColumnSize) + availableSpace}px`
  }

  tableRef.value.style.gridTemplateColumns =  columns.value!
    .map(({ size }) => size)
    .join(' ');
})
</script>

<style lang="scss">
table {
  border-collapse: collapse;
  min-width: 100%;
  width: auto;
  border: 1px solid purple;
  display: grid;
  overflow-x: auto;
  position: relative;
  /* Initial values */
  grid-template-columns:
    minmax(150px, 1fr)
    minmax(150px, 1fr)
    minmax(150px, 1fr)
    minmax(150px, 1fr)
    minmax(150px, 1fr);

  tr:last-of-type td {
    border-bottom: none;
  }
}

thead, tbody, tr {
  display: contents;
}

.header-resized {
  background: palevioletred;
}


td {
  border-right: 1px dashed black;
}

tr:nth-of-type(odd) td {
  background: lightcyan;
}

.cell {
  display: block;
  padding: 6px 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &.align-left {
    text-align: left;
  }
  &.align-center {
    text-align: center;
  }
  &.align-right {
    text-align: right;
  }
  &.freeze {
    background: #39bddd;
    position: sticky;
    left: 0;
    z-index: 1;
  }
}
</style>
