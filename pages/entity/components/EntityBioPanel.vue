<script setup lang="ts">
import type { SchemaEntityEntity } from '@/composables/schema'

interface Props {
  entityData: SchemaEntityEntity
}
const props = defineProps<Props>()
props.entityData.status = 'active'

const standardPlan = {
  plan: 'Standard',
  price: 99,
  benefits: ['10 Users', 'Up to 10GB storage', 'Basic Support'],
}

const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)

// 👉 Status variant resolver
const resolveUserStatusVariant = (stat: string) => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'
  return 'primary'
}

// 👉 Role variant resolver
const resolveUserRoleVariant = (role: string) => {
  if (role === 'subscriber')
    return { color: 'warning', icon: 'tabler-user' }
  if (role === 'author')
    return { color: 'success', icon: 'tabler-circle-check' }
  if (role === 'maintainer')
    return { color: 'primary', icon: 'tabler-chart-pie-2' }
  if (role === 'editor')
    return { color: 'info', icon: 'tabler-pencil' }
  if (role === 'admin')
    return { color: 'secondary', icon: 'tabler-server-2' }
  return { color: 'primary', icon: 'tabler-user' }
}

// 👉 Type resolver
const resolveEntityTypeVariant = (type: string) => {
  if (type === 'employee')
    return { color: 'warning', icon: 'tabler-user' }
  if (type === 'customer')
    return { color: 'success', icon: 'tabler-circle-check' }
  if (type === 'supplier')
    return { color: 'primary', icon: 'tabler-chart-pie-2' }
//   if (role === 'editor')
//     return { color: 'info', icon: 'tabler-pencil' }
//   if (role === 'admin')
//     return { color: 'secondary', icon: 'tabler-server-2' }
  return { color: 'primary', icon: 'tabler-user' }
}
</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.entityData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!props.entityData.avatar ? 'primary' : undefined"
            :variant="!props.entityData.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.entityData.avatar"
              :src="props.entityData.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.entityData.name) }}
            </span>
          </VAvatar>

          <!-- 👉 Name -->
          <h6 class="text-h4 mt-4">
            {{ props.entityData.name }}
          </h6>

          <!-- 👉 Type chip -->
          <VChip
            label
            :color="resolveEntityTypeVariant(props.entityData.type).color"
            size="small"
            class="text-capitalize mt-3"
          >
            {{ props.entityData.type }}
          </VChip>
        </VCardText>

        <VCardText>
          <div class="d-flex justify-center flex-wrap gap-5">
            <!-- 👉 Done task -->
            <div class="d-flex align-center me-8">
              <VAvatar
                :size="38"
                rounded
                color="primary"
                variant="tonal"
                class="me-3"
              >
                <VIcon
                  icon="tabler-checkbox"
                  size="28"
                />
              </VAvatar>
              <div>
                <div class="text-body-1 font-weight-medium">
                  {{ kFormatter(props.entityData.taskDone) }}
                </div>
                <span class="text-sm">Task Done</span>
              </div>
            </div>

            <!-- 👉 Done Project -->
            <div class="d-flex align-center me-4">
              <VAvatar
                :size="38"
                rounded
                color="primary"
                variant="tonal"
                class="me-3"
              >
                <VIcon
                  icon="tabler-briefcase"
                  size="28"
                />
              </VAvatar>
              <div>
                <div class="font-weight-medium">
                  {{ kFormatter(props.entityData.projectDone) }}
                </div>
                <span class="text-sm">Project Done</span>
              </div>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Details -->
        <VCardText>
          <p class="text-sm text-uppercase text-disabled">
            Details
          </p>

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Name:
                  <span class="text-body-1">
                    {{ props.entityData.name }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Description:
                  <span class="text-body-1">
                    {{ props.entityData.description }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Email:
                  <span class="text-body-1">{{ props.entityData.email }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Website:
                  <span class="text-body-1">{{ props.entityData.website }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Type:
                  <span class="text-capitalize text-body-1">{{ props.entityData.type }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Phone:
                  <span class="text-body-1">{{ props.entityData.phone }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <!-- <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Language:
                  <span class="text-body-1">{{ props.entityData.language }}</span>
                </h6>
              </VListItemTitle>
            </VListItem> -->

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Address:
                  <span class="text-body-1">{{ props.entityData.address }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
                <VListItemTitle>
                <h6 class="text-h6">
                    Status:
                    <!-- <span class="text-body-1">Active</span> -->
                    <VChip
                    label
                    size="small"
                    :color="resolveUserStatusVariant(props.entityData.status)"
                    class="text-capitalize"
                    >
                    {{ props.entityData.status }}
                    </VChip>
                </h6>
                </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <VCardText>
          <p class="text-sm text-uppercase text-disabled">
            System Info
          </p>
          <VList class="card-list mt-2">
              <VListItem>
                  <VListItemTitle>
                      <h6 class="text-h6">
                          Created:
                          <!-- <span class="text-body-1">{{ new Date(props.entityData.created_at) }}</span> -->
                          <VChip
                          label
                          size="small"
                          color="primary"
                          class="text-capitalize"
                          >
                          {{ new Date(props.entityData.created_at) }}
                          </VChip>
                      </h6>
                  </VListItemTitle>
              </VListItem>
          </VList>
        </VCardText>
        
        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center">
          <VBtn
            variant="elevated"
            class="me-4"
            @click="isUserInfoEditDialogVisible = true"
          >
            Edit
          </VBtn>

          <VBtn
            variant="tonal"
            color="error"
          >
            Suspend
          </VBtn>
        </VCardText>

      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION Current Plan -->
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
          <!-- 👉 Standard Chip -->
          <VChip
            label
            color="primary"
            size="small"
            class="font-weight-medium"
          >
            Popular
          </VChip>

          <VSpacer />

          <!-- 👉 Current Price  -->
          <div class="d-flex align-center">
            <sup class="text-primary text-sm font-weight-regular">$</sup>
            <h1 class="text-h1 text-primary">
              99
            </h1>
            <sub class="mt-3"><h6 class="text-sm font-weight-regular text-disabled">/ month</h6></sub>
          </div>
        </VCardText>

        <VCardText>
          <!-- 👉 Price Benefits -->
          <VList class="card-list">
            <VListItem
              v-for="benefit in standardPlan.benefits"
              :key="benefit"
            >
              <VIcon
                size="12"
                color="#A8AAAE"
                class="me-2"
                icon="tabler-circle"
              />
              <span>{{ benefit }}</span>
            </VListItem>
          </VList>

          <!-- 👉 Days -->
          <div class="my-6">
            <div class="d-flex mt-3 mb-2">
              <h6 class="text-base font-weight-medium">
                Days
              </h6>
              <VSpacer />
              <h6 class="text-base font-weight-medium">
                26 of 30 Days
              </h6>
            </div>

            <!-- 👉 Progress -->
            <VProgressLinear
              rounded
              rounded-bar
              :model-value="65"
              height="10"
              color="primary"
            />

            <p class="mt-2">
              4 days remaining
            </p>
          </div>

          <!-- 👉 Upgrade Plan -->
          <div class="d-flex gap-4">
            <VBtn @click="isUpgradePlanDialogVisible = true">
              Upgrade Plan
            </VBtn>
            <VBtn
              variant="tonal"
              color="default"
            >
              cancel
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <UserInfoEditDialog
    v-model:isDialogVisible="isUserInfoEditDialogVisible"
    :user-data="props.entityData"
  />

  <!-- 👉 Upgrade plan dialog -->
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
