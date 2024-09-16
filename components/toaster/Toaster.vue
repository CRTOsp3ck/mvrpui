<script setup lang="ts">
import { ref } from 'vue';

const messages = ref([]);

function addMessage(text: string, position: string = 'bottom start') {
  messages.value.push({ text, visible: true, position, multiLine: false });
}

function addMultiLineMessage(text: string, position: string = 'bottom start') {
  messages.value.push({ text, visible: true, position, multiLine: true });
}

function removeMessage(index: number) {
  messages.value.splice(index, 1);
}

// Expose methods to parent components
defineExpose({
  addMessage,
  addMultiLineMessage,
});
</script>

<template>
    <div>
      <VSnackbar
        v-for="(message, index) in messages"
        :key="index"
        v-model="message.visible"
        :location="message.position"
        :multi-line="message.multiLine"
        timeout="100000"
        @timeout="removeMessage(index)"
        vertical
      >
        <div class="mx-8 mt-2">
          {{ message.text }}
        </div>
        <template #actions>
          <VBtn color="error" @click="removeMessage(index)">Close</VBtn>
        </template>
      </VSnackbar>
      
    </div>
  </template>
  