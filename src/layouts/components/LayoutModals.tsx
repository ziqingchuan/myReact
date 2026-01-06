import { lazy, Suspense } from 'react'
import { useUIStore, useDirectoryStore, useArticleStore } from '../../store'
import { getDirectoryOptions } from '../../utils/publicTools'
import { LayoutModalsProps } from '../../types'

const ArticleFormModal = lazy(() => import('../../components/customUI/ArticleFormModal'))
const DirectoryFormModal = lazy(() => import('../../components/customUI/DirectoryFormModal'))


export function LayoutModals({ onSubmitArticle, onSubmitDirectory }: LayoutModalsProps) {
  // UI Store
  const isDark = useUIStore(state => state.isDark)
  
  // Directory Store
  const directories = useDirectoryStore(state => state.directories)
  
  // Article Store
  const showCreateForm = useArticleStore(state => state.showCreateForm)
  const editingArticle = useArticleStore(state => state.editingArticle)
  const formData = useArticleStore(state => state.formData)
  const formLoading = useArticleStore(state => state.formLoading)
  const setFormData = useArticleStore(state => state.setFormData)
  const resetArticleForm = useArticleStore(state => state.resetArticleForm)
  
  // Directory Store (form)
  const showCreateDirForm = useDirectoryStore(state => state.showCreateDirForm)
  const editingDirectory = useDirectoryStore(state => state.editingDirectory)
  const dirFormData = useDirectoryStore(state => state.dirFormData)
  const dirFormLoading = useDirectoryStore(state => state.formLoading)
  const setDirFormData = useDirectoryStore(state => state.setDirFormData)
  const resetDirectoryForm = useDirectoryStore(state => state.resetDirectoryForm)

  return (
    <>
      <Suspense fallback={null}>
        <ArticleFormModal 
          isOpen={showCreateForm}
          editingArticle={editingArticle}
          formData={formData}
          directories={directories}
          formLoading={formLoading}
          onClose={resetArticleForm}
          onSubmit={onSubmitArticle}
          onFormDataChange={setFormData}
          getDirectoryOptions={getDirectoryOptions}
          isDark={isDark}
        />
      </Suspense>

      <Suspense fallback={null}>
        <DirectoryFormModal 
          isOpen={showCreateDirForm}
          editingDirectory={editingDirectory}
          dirFormData={dirFormData}
          directories={directories}
          formLoading={dirFormLoading}
          onClose={resetDirectoryForm}
          onSubmit={onSubmitDirectory}
          onFormDataChange={setDirFormData}
          getDirectoryOptions={getDirectoryOptions}
          isDark={isDark}
        />
      </Suspense>
    </>
  )
}
