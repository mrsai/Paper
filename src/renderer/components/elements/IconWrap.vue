<script lang="ts">
import { computed, defineComponent } from 'vue'
import {
  H1,
  H2,
  H3,
  Checklist,
  ListTop,
  Quote,
  InsertTable,
  CodeOne,
  DividingLine,
  OrderedList,
  CloseOne,
  Delete,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  AlignTextLeft,
  AlignTextCenter,
  AlignTextRight
} from '@icon-park/vue-next'

export default defineComponent({
  components: {
    H1,
    H2,
    H3,
    Checklist,
    ListTop,
    Quote,
    InsertTable,
    CodeOne,
    DividingLine,
    OrderedList,
    CloseOne,
    Delete,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowDown,
    AlignTextLeft,
    AlignTextCenter,
    AlignTextRight
  },
  props: {
    icon: {
      type: String,
      requird: true,
      default: ''
    }
  },
  setup(props, ctx) {
    const iconName = computed(() => {
      return String(props.icon)
    })
    return {
      iconName
    }
  }
})
</script>

<template>
  <component :is="iconName" v-bind="$attrs"></component>
</template>
<style></style>
