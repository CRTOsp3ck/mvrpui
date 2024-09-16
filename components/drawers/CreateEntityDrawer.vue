<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import type { VForm } from 'vuetify/components/VForm'
import type { SchemaEntityEntity } from '@/composables/schema'
import type { SchemaEntityEntityClass } from '@/composables/constructor'

interface Emit {
    (e: 'update:isDrawerOpen', value: boolean): void
    (e: 'entityData', value: SchemaEntityEntityClass): void
}

interface Props {
    isDrawerOpen: boolean,
    entityType: string,
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const isFormValid = ref(false) 
const refForm = ref<VForm>()
const entity = ref<SchemaEntityEntityClass>(new SchemaEntityEntityClass(props.entityType))

// 👉 drawer close
const closeNavigationDrawer = () => {
    emit('update:isDrawerOpen', false)
    nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
    })
}

const onSubmit = () => {
    refForm.value?.validate().then(({ valid }) => {
        if (valid) {
            emit('entityData', entity.value)
            emit('update:isDrawerOpen', false)
            nextTick(() => {
                refForm.value?.reset()
                refForm.value?.resetValidation()
            })
        }
    })
}

const handleDrawerModelValueUpdate = (val: boolean) => {
    emit('update:isDrawerOpen', val)
}
</script>

<template>
    <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content"
        :model-value="props.isDrawerOpen" @update:model-value="handleDrawerModelValueUpdate">
        <!-- 👉 Title -->
        <AppDrawerHeaderSection title="Add User" @cancel="closeNavigationDrawer" />

        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCard flat>
                <VCardText>
                    <!-- 👉 Form -->
                    <VForm ref="refForm" :v-model="isFormValid" @submit.prevent="onSubmit">
                        <VRow>
                            <!-- 👉 Name -->
                            <VCol cols="12">
                                <AppTextField v-model="entity.name" :rules="[requiredValidator]" label="Name"
                                    placeholder="John Doe" />
                            </VCol>

                            <!-- 👉 Phone -->
                            <VCol cols="12">
                                <AppTextField v-model="entity.phone" type="number" :rules="[requiredValidator]"
                                    label="Contact" placeholder="+1-541-754-3010" />
                            </VCol>

                            <!-- 👉 Email -->
                            <VCol cols="12">
                                <AppTextField v-model="entity.email" :rules="[requiredValidator, emailValidator]" label="Email"
                                    placeholder="johndoe@email.com" />
                            </VCol>

                            <!-- 👉 Address -->
                            <VCol cols="12">
                                <AppTextField v-model="entity.address" :rules="[requiredValidator]" label="Address"
                                    placeholder="No 2 Jalan Tiara Kemensah 1 53100 KL" />
                            </VCol>

                            <!-- 👉 Website -->
                            <VCol cols="12">
                                <AppTextField v-model="entity.website" :rules="[requiredValidator]" label="Website"
                                    placeholder="www.microverse.com" />
                            </VCol>

                            <!-- 👉 Status -->
                            <!-- <VCol cols="12">
                                <AppSelect v-model="status" label="Select Status" placeholder="Select Status"
                                    :rules="[requiredValidator]"
                                    :items="[{ title: 'Active', value: 'active' }, { title: 'Inactive', value: 'inactive' }, { title: 'Pending', value: 'pending' }]" />
                            </VCol> -->

                            <!-- 👉 Submit and Cancel -->
                            <VCol cols="12">
                                <VBtn type="submit" class="me-3">
                                    Submit
                                </VBtn>
                                <VBtn type="reset" variant="outlined" color="secondary" @click="closeNavigationDrawer">
                                    Cancel
                                </VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </VCard>
        </PerfectScrollbar>
    </VNavigationDrawer>
</template>
