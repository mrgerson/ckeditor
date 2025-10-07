<template>
  <div class="editor-container container">
    <div class="word-like-document">
      <Editor v-model="content" :init="editorConfig" />
    </div>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

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
        language: 'es',
        language_url: 'https://cdn.jsdelivr.net/npm/tinymce@5.10.9/langs/es.js', 
        branding: false,
        promotion: false
      }
    }
  }
}
</script>

<style scoped>
.editor-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

.word-like-document {
  background-color: #ffffff;
  border: 1px solid #d1d1d1;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.editor-container .tox-tinymce {
  font-family: 'Times New Roman', serif;
  font-size: 14px;
}

</style>
