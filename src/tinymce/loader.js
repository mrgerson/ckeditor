import 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'

import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/help'

import 'tinymce/skins/ui/oxide/skin.min.css'

// En webpack, `require` te da la URL final del asset
export const TINYMCE_CONTENT_CSS_URL =
  require('tinymce/skins/content/default/content.min.css')
