import type { App } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faFolder,
  faFolderOpen,
  faBars,
  faEllipsis,
  faEllipsisVertical,
  faBarsStaggered,
  faCircle,
  faUser,
  faGear,
  faCircleInfo,
  faFileImport
} from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import { faFile } from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(
  faFolder,
  faFolderOpen,
  faBars,
  faMarkdown,
  faFile,
  faEllipsis,
  faEllipsisVertical,
  faBarsStaggered,
  faCircle,
  faUser,
  faGear,
  faCircleInfo,
  faFileImport
)

export const setupIcons = (app: App<Element>) => {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
}
