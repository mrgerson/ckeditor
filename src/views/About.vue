<template>
  <div class="editor-container">
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOptions"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
    />
    
    <!-- Vista previa opcional -->
    <div v-if="showPreview" class="preview">
      <h3>Vista previa:</h3>
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'

// Estilos REQUERIDOS
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'RichTextEditor',
  components: {
    quillEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    showPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: this.value,
      editorOptions: {
        modules: {
          toolbar: {
            container: [
              // Fuente y formato
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              
              // Formato de texto
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'script': 'sub'}, { 'script': 'super' }],
              
              // Alineación y listas
              [{ 'align': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              
              // Bloques y elementos
              ['blockquote', 'code-block'],
              [{ 'direction': 'rtl' }],
              
              // Multimedia y enlaces
              ['link', 'image', 'video'],
              
              // Utilidades
              ['clean']
            ],
            handlers: {
              // Puedes añadir handlers personalizados aquí
              'image': this.imageHandler
            }
          }
        },
        theme: 'snow',
        placeholder: 'Escribe tu contenido aquí...',
        readOnly: false
      }
    }
  },
  watch: {
    value(newVal) {
      if (newVal !== this.content) {
        this.content = newVal
      }
    },
    content(newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    onEditorBlur(quill) {
      console.log('Editor pierde foco', quill)
    },
    onEditorFocus(quill) {
      console.log('Editor gana foco', quill)
    },
    onEditorReady(quill) {
      console.log('Editor listo', quill)
    },
    onEditorChange({ quill, html, text }) {
      console.log('quill', quill)
      console.log('Contenido cambiado:', { html, text })
      this.$emit('change', { html, text })
    },
    
    imageHandler() {
      // Handler personalizado para imágenes
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()
      
      input.onchange = async () => {
        const file = input.files[0]
        if (file) {
          // Aquí puedes subir la imagen a tu servidor
          // Por ahora usamos una URL temporal
          const imageUrl = URL.createObjectURL(file)
          
          // Insertar imagen en el editor
          const quill = this.$refs.myQuillEditor.quill
          const range = quill.getSelection()
          quill.insertEmbed(range.index, 'image', imageUrl)
        }
      }
    },
    
    // Métodos útiles para controlar el editor
    getEditor() {
      return this.$refs.myQuillEditor.quill
    },
    
    setContent(html) {
      this.content = html
    },
    
    clearContent() {
      this.content = ''
    },
    
    getText() {
      return this.getEditor().getText()
    },
    
    getHTML() {
      return this.content
    }
  },
  
  mounted() {
    console.log('Quill.js editor montado')
  }
}
</script>

<style scoped>
.editor-container {
  margin: 20px 0;
}

/* Estilos para el editor */
.quill-editor {
  min-height: 400px;
}

/* Personalizar la apariencia del editor */
:deep(.ql-editor) {
  min-height: 300px;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.ql-toolbar) {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

:deep(.ql-container) {
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  min-height: 300px;
}

.preview {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
}
</style>