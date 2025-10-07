<template>
    <div class="word-like-editor">
      <froala 
        :tag="'textarea'" 
        :config="config" 
        v-model="content"
      ></froala>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        content: '<p>¡Editor que se parece a Microsoft Word!</p>',
        config: {
          // 🎯 INTERFAZ MUY PARECIDA A WORD
          height: 600,
          theme: 'gray', // Tema estilo Office
          
          // 🛠️ TOOLBAR COMPLETA (como Word)
          toolbarButtons: {
            'moreText': {
              'buttons': [
                'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'
              ]
            },
            'moreParagraph': {
              'buttons': [
                'alignLeft', 'alignCenter', 'alignRight', 'alignJustify',
                'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle',
                'lineHeight', 'outdent', 'indent', 'quote'
              ]
            },
            'moreRich': {
              'buttons': [
                'insertLink', 'insertImage', 'insertVideo', 'insertTable',
                'emoticons', 'specialCharacters', 'insertHR'
              ]
            },
            'moreMisc': {
              'buttons': [
                'undo', 'redo', 'fullscreen', 'print', 'spellChecker',
                'selectAll', 'html', 'help'
              ]
            }
          },
  
          // 🔧 PLUGINS HABILITADOS
          pluginsEnabled: [
            'align', 'charCounter', 'codeView', 'colors', 'draggable', 'embedly',
            'emoticons', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen',
            'help', 'image', 'imageManager', 'inlineStyle', 'lineBreaker', 'link',
            'lists', 'paragraphFormat', 'paragraphStyle', 'quickInsert', 'quote',
            'save', 'table', 'url', 'video', 'wordPaste'
          ],
  
          // 📊 CONFIGURACIÓN DE TABLAS (como Word)
          tableEditButtons: ['tableHeader', 'tableRemove', 'tableRows', 'tableColumns', 'tableStyle'],
          tableStyles: {
            'table-gray': 'Tabla Gris',
            'table-bordered': 'Tabla con Bordes', 
            'table-striped': 'Tabla Rayada'
          },
  
          // 📄 CONFIGURACIÓN DE IMÁGENES
          imageEditButtons: ['imageReplace', 'imageAlign', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove'],
          
          // 🎨 CONFIGURACIÓN DE FUENTES
          fontFamily: {
            'Arial,Helvetica,sans-serif': 'Arial',
            'Georgia,serif': 'Georgia',
            'Impact,Charcoal,sans-serif': 'Impact',
            'Tahoma,Geneva,sans-serif': 'Tahoma',
            "'Times New Roman',Times,serif": 'Times New Roman',
            'Verdana,Geneva,sans-serif': 'Verdana'
          },
  
          fontSize: ['8', '10', '12', '14', '18', '24', '36'],
  
          // 🚫 SIN LÍMITE DE CARACTERES
          charCounterCount: false,
  
          // 🌐 IDIOMA ESPAÑOL
          language: 'es',
  
          // 🔄 COMPORTAMIENTO FAMILIAR
          pasteAllowedStyleProps: ['font', 'font-size', 'color', 'background-color'],
          toolbarSticky: true,
          toolbarInline: false,
          quickInsertEnabled: true,
          
          // 📏 ESPACIADO Y FORMATO
          paragraphFormat: {
            N: 'Normal',
            H1: 'Título 1',
            H2: 'Título 2', 
            H3: 'Título 3',
            H4: 'Título 4',
            PRE: 'Código'
          },
          
          // 🎪 EVENTOS
          events: {
            'initialized': function() {
              console.log('Froala Editor inicializado - Interfaz tipo Word lista');
            }
          }
        }
      }
    },
    methods: {
      // Métodos adicionales si los necesitas
      getContent() {
        return this.content;
      },
      setContent(html) {
        this.content = html;
      }
    },
    mounted() {
      console.log('Editor Froala cargado - Interfaz similar a Word');
    }
  }
  </script>
  
  <style scoped>
  .word-like-editor {
    border: 1px solid #c1c1c1;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  /* Mejorar la apariencia para que se parezca más a Word */
  :deep(.fr-toolbar) {
    border-bottom: 1px solid #e0e0e0 !important;
    background: #f8f8f8 !important;
  }
  
  :deep(.fr-wrapper) {
    background: white !important;
    min-height: 500px;
  }
  
  :deep(.fr-box) {
    border: none !important;
  }
  </style>