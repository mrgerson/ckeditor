<template>
  <div class="home container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h2 class="card-title mb-0">
              <i class="fas fa-edit mr-2"></i>Editor de Texto
            </h2>
          </div>
          <div class="card-body">
            <ckeditor
              :editor="editor"
              v-model="editorData"
              :config="editorConfig"
            ></ckeditor>
          </div>
          <div class="card-footer text-muted">
            <small>Editor CKEditor 5 integrado con Bootstrap</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  name: 'Home',
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: '<p>¡Bienvenido al editor de texto! Puedes escribir aquí...</p>',
      editorConfig: {
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'link', '|',
          'bulletedList', 'numberedList', '|',
          'outdent', 'indent', '|',
          'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|',
          'undo', 'redo'
        ],
        language: 'es'
      }
    }
  }
}
</script>

<style scoped>
.home {
  padding: 2rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

:deep(.ck-editor__editable) {
  min-height: 300px;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

:deep(.ck.ck-editor__main > .ck-editor__editable:not(.ck-focused)) {
  border-color: #dee2e6;
}

:deep(.ck.ck-editor__main > .ck-editor__editable.ck-focused) {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

:deep(.ck.ck-toolbar) {
  border-radius: 0.375rem 0.375rem 0 0;
  border: 1px solid #dee2e6;
  border-bottom: none;
}

:deep(.ck.ck-toolbar__separator) {
  background: #dee2e6;
}

.card {
  border: none;
  border-radius: 0.5rem;
}

.card-header {
  border-radius: 0.5rem 0.5rem 0 0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>