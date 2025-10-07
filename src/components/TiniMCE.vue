<template>
  <div class="editor-container">
    <Editor v-model="content" :init="editorConfig" />
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import '../tinymce/loader'
import { TINYMCE_CONTENT_CSS_URL } from '../tinymce/loader'


export default {
  name: 'TinyMCEFixed',
  components: { Editor },
  data() {
    return {
      content: `
        <h1>¡Editor Funcionando! 🎉</h1>
        <p>Editor local sin validación online.</p>
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
        // Estilos
        skin: 'oxide',                  // UI skin ya importado por CSS
        content_css: TINYMCE_CONTENT_CSS_URL, // estilos dentro del iframe
        branding: false,
        promotion: false
      }
    }
  }
}
</script>
