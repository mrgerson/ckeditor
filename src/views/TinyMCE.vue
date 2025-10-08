<template>
  <div class="editor-container container-fluid">
    <div class="row">
      <!-- Panel de bloques reutilizables -->
      <div class="col-md-3">
        <div class="card blocks-panel">
          <div
            class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">Bloques Reutilizables</h5>
            <span class="badge badge-light">{{ reusableBlocks.length }}</span>
          </div>
          <div class="card-body p-0">
            <draggable
              v-model="reusableBlocks"
              group="blocks"
              handle=".handle"
              @start="drag = true"
              @end="
                drag = false;
                onBlocksReordered();
              "
              class="blocks-list list-group list-group-flush"
            >
              <div
                v-for="(block, index) in reusableBlocks"
                :key="index"
                class="reusable-block list-group-item d-flex justify-content-between align-items-center"
                draggable="true"
                @dragstart="onDragStart($event, block)"
                @click="editBlock(block)"
              >
                <div class="d-flex align-items-center">
                  <span class="handle mr-2 text-muted">☰</span>
                  <div class="block-info">
                    <h6 class="mb-0 text-truncate" style="max-width: 150px">
                      {{ block.title }}
                    </h6>
                    <small class="text-muted">{{ block.id }}</small>
                  </div>
                </div>
                <div class="block-actions">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click.stop="editBlock(block)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            </draggable>
            <div
              v-if="reusableBlocks.length === 0"
              class="text-center p-3 text-muted"
            >
              <i class="fas fa-cubes fa-2x mb-2"></i>
              <p>No hay bloques disponibles</p>
            </div>
          </div>
          <div class="card-footer">
            <button
              class="btn btn-success btn-block"
              @click="showAddBlockModal = true"
            >
              <i class="fas fa-plus mr-1"></i> Nuevo Bloque
            </button>
          </div>
        </div>

        <!-- Panel de versiones (se muestra cuando se edita un bloque) -->
        <div
          v-if="showVersionsPanel && currentBlock"
          class="card mt-3 versions-panel"
        >
          <div class="card-header bg-info text-white">
            <h6 class="mb-0">Historial de Versiones</h6>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div
                v-for="(version, index) in blockVersions[currentBlock.id] || []"
                :key="index"
                class="list-group-item version-item"
                :class="{
                  active: index === blockVersions[currentBlock.id].length - 1,
                }"
                @click="restoreVersion(version)"
              >
                <div class="d-flex w-100 justify-content-between">
                  <small>{{ formatDate(version.timestamp) }}</small>
                  <span class="badge badge-secondary">{{ index + 1 }}</span>
                </div>
                <p class="mb-1 text-truncate">{{ version.title }}</p>
              </div>
              <div
                v-if="
                  !blockVersions[currentBlock.id] ||
                  blockVersions[currentBlock.id].length === 0
                "
                class="text-center p-3 text-muted"
              >
                <small>No hay versiones anteriores</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Área del editor principal -->
      <div class="col-md-9">
        <div class="card word-like-document">
          <div
            class="card-header bg-white border-bottom d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">Documento</h5>
            <div class="btn-group">
              <button
                class="btn btn-outline-secondary btn-sm"
                @click="toggleFullscreen"
              >
                <i
                  class="fas"
                  :class="fullscreen ? 'fa-compress' : 'fa-expand'"
                ></i>
              </button>
              <button
                class="btn btn-outline-primary btn-sm"
                @click="saveDocument"
              >
                <i class="fas fa-save mr-1"></i> Guardar
              </button>
            </div>
          </div>
          <div class="card-body p-0">
            <Editor v-model="content" :init="editorConfig" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para editar bloques -->
    <div
      v-if="showEditModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Editar Bloque: {{ currentBlock.title }}</h5>
            <button
              type="button"
              class="close text-white"
              @click="cancelBlockEdit"
            >
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="blockTitle">Título:</label>
              <input
                id="blockTitle"
                v-model="currentBlock.title"
                type="text"
                class="form-control"
                placeholder="Ingrese un título descriptivo"
              />
            </div>
            <div class="form-group">
              <label for="blockContent">Contenido:</label>
              <Editor
                id="blockContent"
                v-model="currentBlockContent"
                :init="blockEditorConfig"
                class="block-editor"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelBlockEdit"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="saveBlockChanges"
            >
              <i class="fas fa-save mr-1"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showEditModal" class="modal-backdrop fade show"></div>

    <!-- Modal para añadir nuevo bloque -->
    <div
      v-if="showAddBlockModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Nuevo Bloque Reutilizable</h5>
            <button
              type="button"
              class="close text-white"
              @click="showAddBlockModal = false"
            >
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="newBlockId">ID:</label>
              <input
                id="newBlockId"
                v-model="newBlock.id"
                type="text"
                class="form-control"
                placeholder="identificador-unico"
                :class="{ 'is-invalid': idExists }"
              />
              <div v-if="idExists" class="invalid-feedback">
                Ya existe un bloque con este ID
              </div>
              <small class="form-text text-muted">
                Use un identificador único sin espacios (ej:
                procedimiento-seguridad)
              </small>
            </div>
            <div class="form-group">
              <label for="newBlockTitle">Título:</label>
              <input
                id="newBlockTitle"
                v-model="newBlock.title"
                type="text"
                class="form-control"
                placeholder="Ingrese un título descriptivo"
              />
            </div>
            <div class="form-group">
              <label for="newBlockContent">Contenido:</label>
              <Editor
                id="newBlockContent"
                v-model="newBlockContent"
                :init="blockEditorConfig"
                class="block-editor"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showAddBlockModal = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="addNewBlock"
              :disabled="!newBlock.id || !newBlock.title || idExists"
            >
              <i class="fas fa-plus mr-1"></i> Crear Bloque
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddBlockModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import draggable from "vuedraggable";

export default {
  name: "TinyMCEFixed",
  components: {
    Editor,
    draggable,
  },
  data() {
    return {
      drag: false,
      content: `
        <h1>¡Editor Funcionando! 🎉</h1>
        <p>Editor local sin validación online.</p>
        <table border="1" style="border-collapse:collapse;width:100%">
          <tr><th>Columna 1</th><th>Columna 2</th><th>Columna 3</th></tr>
          <tr><td>Dato 1</td><td>Dato 2</td><td>Dato 3</td></tr>
          <tr><td>Dato 4</td><td>Dato 5</td><td>Dato 6</td></tr>
        </table>
      `,
      reusableBlocks: [
        {
          id: "inspector-seguridad",
          title: "Inspector de Seguridad",
          content: `<div class="reusable-content" data-block-id="inspector-seguridad">
            <h3>Inspector de Seguridad</h3>
            <p>Nombre: Juan Pérez</p>
            <p>Cargo: Inspector Principal</p>
            <p>Contacto: juan.perez@empresa.com</p>
          </div>`,
        },
        {
          id: "procedimiento-evacuacion",
          title: "Procedimiento de Evacuación",
          content: `<div class="reusable-content" data-block-id="procedimiento-evacuacion">
            <h3>Procedimiento de Evacuación</h3>
            <ol>
              <li>Mantener la calma</li>
              <li>Seguir las rutas de evacuación señalizadas</li>
              <li>Dirigirse al punto de encuentro</li>
              <li>Esperar instrucciones del personal autorizado</li>
            </ol>
          </div>`,
        },
        {
          id: "equipo-proteccion",
          title: "Equipo de Protección",
          content: `<div class="reusable-content" data-block-id="equipo-proteccion">
            <h3>Equipo de Protección Personal</h3>
            <ul>
              <li>Casco de seguridad</li>
              <li>Chaleco reflectante</li>
              <li>Botas con punta de acero</li>
              <li>Guantes de protección</li>
            </ul>
          </div>`,
        },
      ],
      showEditModal: false,
      showAddBlockModal: false,
      showVersionsPanel: false,
      currentBlock: null,
      currentBlockContent: "",
      newBlock: {
        id: "",
        title: "",
      },
      newBlockContent: "",
      blockVersions: {}, // Almacenará el historial de versiones de cada bloque
      fullscreen: false,
    };
  },
  computed: {
    idExists() {
      return this.reusableBlocks.some((b) => b.id === this.newBlock.id);
    },
    editorConfig() {
      return {
        height: 700,
        menubar: "file edit view insert format tools table help",
        plugins:
          "advlist autolink lists link image charmap preview anchor " +
          "searchreplace visualblocks code fullscreen insertdatetime media table wordcount help",
        toolbar:
          "undo redo | formatselect | bold italic underline | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | link image table | insertblock | removeformat code | help",
        // Estilos
        skin: "oxide", // UI skin ya importado por CSS
        language: "es",
        language_url: "https://cdn.jsdelivr.net/npm/tinymce@5.10.9/langs/es.js",
        branding: false,
        promotion: false,
        setup: (editor) => {
          // Registrar plugin personalizado
          editor.ui.registry.addButton("insertblock", {
            text: "Insertar Bloque",
            tooltip: "Insertar bloque reutilizable",
            onAction: () => {
              // Mostrar menú de bloques disponibles
              const items = this.reusableBlocks.map((block) => ({
                type: "menuitem",
                text: block.title,
                onAction: () => {
                  // Insertar el contenido COMPLETO del bloque
                  editor.insertContent(block.content);
                },
              }));

              // Crear menú desplegable dinámico
              const menuItems =
                items.length > 0
                  ? items
                  : [
                      {
                        type: "menuitem",
                        text: "No hay bloques disponibles",
                        onAction: () => {},
                      },
                    ];

              editor.ui.registry.showMenuButton("insertblockmenu", {
                text: "Bloques",
                fetch: (callback) => {
                  callback(menuItems);
                },
              });
            },
          });

          editor.on("init", () => {
            // Configurar el manejo de arrastrar y soltar después de que el editor se inicialice
            this.$nextTick(() => {
              this.setupTinyMCEDropZone();
            });
          });

          // Detectar cambios en bloques reutilizables
          editor.on("Change", () => {
            // Verificar si hay bloques reutilizables en el contenido
            const content = editor.getContent();
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;

            // Buscar todos los bloques reutilizables
            const blockElements = tempDiv.querySelectorAll(
              ".reusable-content[data-block-id]"
            );

            blockElements.forEach((element) => {
              const blockId = element.getAttribute("data-block-id");
              const blockIndex = this.reusableBlocks.findIndex(
                (b) => b.id === blockId
              );

              if (blockIndex !== -1) {
                // Comparar contenido - usar el HTML completo del elemento
                const currentContent = element.outerHTML.trim();
                const originalContent = this.reusableBlocks[blockIndex].content;

                if (originalContent !== currentContent) {
                  // El bloque ha sido modificado en el editor
                  console.log(`Bloque ${blockId} modificado en el editor`);

                  // Preguntar al usuario si desea actualizar todas las instancias
                  if (
                    confirm(
                      `Has modificado el bloque "${this.reusableBlocks[blockIndex].title}". ¿Deseas actualizar todas las instancias de este bloque?`
                    )
                  ) {
                    // Actualizar el bloque original con el nuevo contenido
                    this.reusableBlocks[blockIndex].content = currentContent;

                    // Actualizar todas las instancias
                    this.updateReusableBlocks();

                    // Guardar en localStorage
                    this.saveBlocksToLocalStorage();
                  }
                }
              }
            });
          });
        },
      };
    },
    blockEditorConfig() {
      return {
        height: 300,
        menubar: false,
        plugins: "lists link table code",
        toolbar:
          "undo redo | formatselect | bold italic | bullist numlist | link table | code",
        skin: "oxide",
        language: "es",
        language_url: "https://cdn.jsdelivr.net/npm/tinymce@5.10.9/langs/es.js",
        branding: false,
        promotion: false,
      };
    },
  },
  methods: {
    /*   onDragStart(event, block) {
      console.log('event', event)
      console.log('block', block)
      // Para arrastrar al editor de TinyMCE - pasar el contenido COMPLETO
      event.dataTransfer.setData('text/plain', block.content);
      event.dataTransfer.effectAllowed = 'copy';
      console.log('Iniciando arrastre del bloque (contenido completo):', block.id);
    } */
    onDragStart(event, block) {
      event.dataTransfer.setData("text/html", block.content); // <--- Cambia aquí
      event.dataTransfer.setData("text/plain", block.content); // Fallback opcional
      event.dataTransfer.effectAllowed = "copy";
    },

    onBlocksReordered() {
      // Guardar el nuevo orden en localStorage
      this.saveBlocksToLocalStorage();
      console.log("Bloques reordenados y guardados");
    },

    setupTinyMCEDropZone() {
      // Esta función se llamará después de que TinyMCE se inicialice
      if (window.tinymce) {
        const editor = window.tinymce.get(
          Object.keys(window.tinymce.editors)[0]
        );
        if (editor) {
          console.log("Configurando zona de drop para TinyMCE");

          editor.getBody().addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          });

          editor.getBody().addEventListener("drop", (e) => {
            console.log("Drop detectado en el editor");
            if (e.dataTransfer) {
              e.preventDefault();
              const content = e.dataTransfer.getData("text/html") || e.dataTransfer.getData("text/plain");
              console.log(
                "Contenido a insertar:",
                content.substring(0, 50) + "..."
              );
              editor.insertContent(content);
            }
          });
        }
      }
    },

    editBlock(block) {
      this.currentBlock = JSON.parse(JSON.stringify(block)); // Clonar para no modificar directamente
      // Para el modal, extraer el contenido interno para edición
      this.currentBlockContent = this.extractInnerContent(block.content);
      this.showEditModal = true;
      this.showVersionsPanel = true;
    },

    saveBlockChanges() {
      if (!this.currentBlock) return;

      // Encontrar el bloque original
      const blockIndex = this.reusableBlocks.findIndex(
        (b) => b.id === this.currentBlock.id
      );
      if (blockIndex === -1) return;

      // Guardar versión anterior
      if (!this.blockVersions[this.currentBlock.id]) {
        this.blockVersions[this.currentBlock.id] = [];
      }

      this.blockVersions[this.currentBlock.id].push({
        timestamp: new Date().toISOString(),
        content: this.reusableBlocks[blockIndex].content,
        title: this.reusableBlocks[blockIndex].title,
      });

      // Limitar a 5 versiones por bloque
      if (this.blockVersions[this.currentBlock.id].length > 5) {
        this.blockVersions[this.currentBlock.id].shift();
      }

      // Actualizar el bloque con el contenido envuelto en el div contenedor
      this.reusableBlocks[blockIndex].title = this.currentBlock.title;
      this.reusableBlocks[
        blockIndex
      ].content = `<div class="reusable-content" data-block-id="${this.currentBlock.id}">
        ${this.currentBlockContent}
      </div>`;

      // Actualizar todas las instancias en el editor
      this.updateReusableBlocks();

      // Guardar en localStorage
      this.saveBlocksToLocalStorage();
      this.saveVersionsToLocalStorage();

      this.showEditModal = false;
      this.showVersionsPanel = false;
    },

    extractInnerContent(htmlString) {
      // Solo para el modal de edición - extraer contenido interno
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlString;
      const innerElement = tempDiv.firstElementChild;

      if (innerElement && innerElement.classList.contains("reusable-content")) {
        return innerElement.innerHTML;
      }

      // Si no encuentra la estructura esperada, devolver el contenido original
      return htmlString;
    },

    cancelBlockEdit() {
      this.showEditModal = false;
      this.currentBlock = null;
      this.currentBlockContent = "";
      this.showVersionsPanel = false;
    },

    addNewBlock() {
      if (!this.newBlock.id || !this.newBlock.title) {
        alert("Por favor completa todos los campos");
        return;
      }

      // Verificar que el ID sea único
      if (this.reusableBlocks.some((b) => b.id === this.newBlock.id)) {
        alert("Ya existe un bloque con ese ID");
        return;
      }

      // Crear nuevo bloque
      const newBlock = {
        id: this.newBlock.id,
        title: this.newBlock.title,
        content: `<div class="reusable-content" data-block-id="${this.newBlock.id}">
          ${this.newBlockContent}
        </div>`,
      };

      this.reusableBlocks.push(newBlock);

      // Guardar en localStorage
      this.saveBlocksToLocalStorage();

      // Limpiar formulario
      this.newBlock = { id: "", title: "" };
      this.newBlockContent = "";
      this.showAddBlockModal = false;
    },

    saveBlocksToLocalStorage() {
      localStorage.setItem(
        "reusableBlocks",
        JSON.stringify(this.reusableBlocks)
      );
    },

    loadBlocksFromLocalStorage() {
      const savedBlocks = localStorage.getItem("reusableBlocks");
      if (savedBlocks) {
        this.reusableBlocks = JSON.parse(savedBlocks);
      }
    },

    saveVersionsToLocalStorage() {
      localStorage.setItem("blockVersions", JSON.stringify(this.blockVersions));
    },

    loadVersionsFromLocalStorage() {
      const savedVersions = localStorage.getItem("blockVersions");
      if (savedVersions) {
        this.blockVersions = JSON.parse(savedVersions);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    },

    restoreVersion(version) {
      if (!this.currentBlock) return;

      if (confirm(`¿Restaurar esta versión del bloque?`)) {
        this.currentBlock.title = version.title;
        this.currentBlockContent = this.extractInnerContent(version.content);
      }
    },

    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
      const editorContainer = document.querySelector(".word-like-document");

      if (this.fullscreen) {
        editorContainer.classList.add("fullscreen");
        document.body.style.overflow = "hidden";
      } else {
        editorContainer.classList.remove("fullscreen");
        document.body.style.overflow = "";
      }
    },

    saveDocument() {
      // Aquí puedes implementar la lógica para guardar el documento
      alert("Documento guardado correctamente");
    },

    updateReusableBlocks() {
      // Actualizar bloques con el mismo ID en todo el documento
      if (window.tinymce) {
        const editor = window.tinymce.get(
          Object.keys(window.tinymce.editors)[0]
        );
        if (editor) {
          this.reusableBlocks.forEach((block) => {
            // Buscar todos los bloques con este ID y actualizarlos
            const blockElements = editor.dom.select(
              `div[data-block-id="${block.id}"]`
            );
            blockElements.forEach((element) => {
              // Actualizar el contenido del bloque con la versión más reciente
              element.outerHTML = block.content;
              console.log(`Bloque actualizado: ${block.id}`);
            });
          });
        }
      }
    },
  },
  mounted() {
    // Cargar bloques guardados al iniciar
    this.loadBlocksFromLocalStorage();
    this.loadVersionsFromLocalStorage();
  },
};
</script>

<style scoped>
.editor-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.blocks-panel {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  height: fit-content;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.blocks-list {
  overflow-y: auto;
  flex-grow: 1;
  max-height: 60vh;
}

.reusable-block {
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.reusable-block:hover {
  background-color: #f8f9fa;
  border-left-color: #007bff;
}

.handle {
  cursor: move;
}

.block-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.reusable-block:hover .block-actions {
  opacity: 1;
}

.word-like-document {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: all 0.3s;
}

.word-like-document.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  margin: 0;
}

.versions-panel {
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.version-item {
  cursor: pointer;
  transition: all 0.2s;
}

.version-item:hover {
  background-color: #f8f9fa;
}

.version-item.active {
  background-color: #e9ecef;
  border-left: 3px solid #17a2b8;
}

/* Estilo para los bloques reutilizables dentro del editor */
:deep(.reusable-content) {
  border: 1px dashed #007bff;
  padding: 10px;
  margin: 10px 0;
  background-color: rgba(0, 123, 255, 0.05);
  border-radius: 4px;
  position: relative;
}

:deep(.reusable-content)::before {
  content: "Bloque reutilizable";
  position: absolute;
  top: -10px;
  left: 10px;
  background: #007bff;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 3px;
}

/* Mejoras para el modal */
.modal-content {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .editor-container {
    padding: 10px;
  }

  .blocks-panel {
    margin-bottom: 20px;
  }

  .block-info h6 {
    max-width: 120px;
  }
}
</style>
