declare module '*.ttl' {
  import type { DatasetCore } from '@rdfjs/types'
  const content: DatasetCore
  export default content
}
