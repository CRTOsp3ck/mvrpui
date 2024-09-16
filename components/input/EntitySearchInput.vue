<script setup lang="ts">
import { ref, watch } from 'vue'
import Toaster from '@/components/toaster/Toaster.vue';
import type { SchemaEntityEntity } from '@/composables/schema';

interface Props {
  entityId?: number
}
const props = defineProps<Props>()

interface Emit {
    (e: 'update:isEntitySelected', value: boolean): void
    (e: 'entityData', value: SchemaEntityEntity): void
}
const emit = defineEmits<Emit>()

const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

const loading = ref(false)
const search = ref<string>()
const select = ref<string>()

const entities = ref<string[]>([])
const entitiesData = ref<SchemaEntityEntity[]>([])

const entityTypes = ['customer', 'supplier']
const selectedEntityType = ref('customer')

const querySelections = async (query: string) => {
  if (loading.value) return
  loading.value = true
  await fetchEntities(query)
  entities.value = entitiesData.value.map((item: SchemaEntityEntity) => `${item.code} - ${item.name}`)
  loading.value = false
}

watch(selectedEntityType, () => {
  querySelections('')
})

watch(search, query => {
  query && query !== select.value && querySelections(query)
})

watch(select, () => {
  const selectedEntityData = entitiesData.value.find(
    (item: SchemaEntityEntity) => `${item.code} - ${item.name}` === select.value)
  if (selectedEntityData) {
    emit('update:isEntitySelected', true)
    emit('entityData', selectedEntityData)
  }
})

const fetchEntities = async (query: string) => {
    const req = {
        items_per_page: 50,
        keyword: query,
        order_by: 'created_at',
        page: 1,
        sort_by: "asc",
        type: selectedEntityType.value,
    }
    const resp = await searchEntitiesService(req)
    if (resp.status === 200 || resp.status === 201) {
        const data: any = resp.data
        entitiesData.value = data.payload
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
}

const getEntity = async (id: number) => {
  const resp = await getEntityService(id)
  const data: any = resp.data
  if (data && data.payload) {
    select.value = `${data.payload.code} - ${data.payload.name}`
  } else if (resp.message || resp.error) {
    const msg = resp.message || resp.error
    showMultiLineMessage(msg || 'An error occurred while sending the request');
  }
}

await querySelections('')

if (props.entityId && props.entityId > 0) {
  getEntity(props.entityId)
}

</script>

<template>
  <div>
    <VRow class="pt-8 px-8">
      <VCol cols="12" md="6">
        <VSelect
          v-model="selectedEntityType"
          :items="entityTypes"
          label="Entity Type"
          placeholder="Select Entity Type"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VAutocomplete
          v-model="select"
          v-model:search="search"
          :loading="loading"
          :items="entities"
          placeholder="Select Entity"
          label="Select Entity"
          variant="underlined"
          :menu-props="{ maxHeight: '200px' }"
        />
      </VCol>
    </VRow>

    <!-- Toaster -->
    <Toaster ref="toaster" />
  </div>
  
</template>
