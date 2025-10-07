<template>
    <div>
      <!-- ✅ Ya no necesitas importar en cada componente -->
      <TinyMCEEditor v-model="content" />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        content: ''
      }
    }
  }
  </script>