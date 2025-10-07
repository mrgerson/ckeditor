<template>
  <div class="editor-container">
    <Editor v-model="content" :init="editorConfig" :api-key="apiKey" />
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'TinyMCEFixed',
  components: { Editor },
  data() {
    return {
      apiKey: process.env.VUE_APP_TINYMCE_API_KEY,
      content: `
        <h1>¡Editor Funcionando! 🎉</h1>
        <p>Este editor funciona con la API Key y usa los estilos predeterminados.</p>
        <table border="1" style="border-collapse:collapse;width:100%">
          <tr><th>Columna 1</th><th>Columna 2</th><th>Columna 3</th></tr>
          <tr><td>Dato 1</td><td>Dato 2</td><td>Dato 3</td></tr>
          <tr><td>Dato 4</td><td>Dato 5</td><td>Dato 6</td></tr>
        </table>
      `
    }
  },
  computed: {
    editorConfig() {
      return {
        height: 700,
        menubar: 'file edit view insert format tools table help',
        plugins:
          'advlist autolink lists link image charmap preview anchor ' +
          'searchreplace visualblocks code fullscreen insertdatetime media table wordcount help',
        toolbar:
          'undo redo | formatselect | bold italic underline | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image table | removeformat code | help',
        // Al usar la API Key, no necesitas content_css o skin manualmente
        branding: false,
        promotion: false,
      }
    }
  }
}
</script>
