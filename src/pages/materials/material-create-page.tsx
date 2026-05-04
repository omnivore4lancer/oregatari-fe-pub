import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { queryKeys } from '../../lib/queryKeys'
import { useQueryWithError } from '../../lib/useQueryWithError'

import { ArrowLeftIcon } from '../../components/Icons'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import type {
  MaterialBasicForm,
  MaterialSceneForm,
  MaterialVisualForm,
} from '../../features/materials'
import {
  ART_STYLES,
  ASPECT_RATIOS,
  BasicInfoSection,
  materialApi,
  materialGroupApi,
  SceneDescSection,
  TIME_SLOTS,
  VisualElementsSection,
  WEATHER_OPTIONS,
} from '../../features/materials'
export default function MaterialCreatePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()
  const { showToast } = useToast()

  const { data: groups = [] } = useQueryWithError({
    queryKey: queryKeys.materialGroups(storyId),
    queryFn: () =>
      materialGroupApi.getGroups(storyId).then((list) =>
        list.map((g) => ({ id: String(g.id), label: g.name })),
      ),
  })

  const [basic, setBasic] = useState<MaterialBasicForm>({
    name: '',
    groupId: '',
    description: '',
    aspectRatio: ASPECT_RATIOS[0],
    artStyle: ART_STYLES[0],
  })

  const [scene, setScene] = useState<MaterialSceneForm>({
    locationMain: '',
    locationDetail: '',
    worldSetting: '',
    timeSlot: TIME_SLOTS[0],
    weather: WEATHER_OPTIONS[0],
    skyDesc: '',
    lighting: '',
  })

  const [visual, setVisual] = useState<MaterialVisualForm>({
    fgLStructure: '',
    fgLTexture: '',
    fgLFurniture: '',
    fgLProps: '',
    mgCGround: '',
    mgCDecoration: '',
    mgCAtmosphere: '',
    mgRStructure: '',
    mgRItems: '',
    bgBuilding: '',
    bgTerrain: '',
  })

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (groups.length > 0 && !basic.groupId) {
      setBasic((prev) => ({ ...prev, groupId: groups[0].id }))
    }
  }, [groups, basic.groupId])

  function handleBack() {
    navigate(`/stories/${id}/materials`)
  }

  async function handleGenerate() {
    if (!basic.name.trim() || !scene.locationMain.trim() || !basic.groupId) return
    setSubmitting(true)
    try {
      await materialApi.createMaterial(storyId, {
        groupId: Number(basic.groupId),
        name: basic.name.trim(),
        description: basic.description.trim() || undefined,
        aspectRatio: basic.aspectRatio,
        artStyle: basic.artStyle,
        locationMain: scene.locationMain.trim(),
        locationDetail: scene.locationDetail.trim() || undefined,
        worldSetting: scene.worldSetting.trim() || undefined,
        timeSlot: scene.timeSlot,
        weather: scene.weather,
        skyDesc: scene.skyDesc.trim() || undefined,
        lighting: scene.lighting.trim() || undefined,
        fgLStructure: visual.fgLStructure.trim() || undefined,
        fgLTexture: visual.fgLTexture.trim() || undefined,
        fgLFurniture: visual.fgLFurniture.trim() || undefined,
        fgLProps: visual.fgLProps.trim() || undefined,
        mgCGround: visual.mgCGround.trim() || undefined,
        mgCDecoration: visual.mgCDecoration.trim() || undefined,
        mgCAtmosphere: visual.mgCAtmosphere.trim() || undefined,
        mgRStructure: visual.mgRStructure.trim() || undefined,
        mgRItems: visual.mgRItems.trim() || undefined,
        bgBuilding: visual.bgBuilding.trim() || undefined,
        bgTerrain: visual.bgTerrain.trim() || undefined,
      })
      showToast('素材を登録しました')
      navigate(`/stories/${id}/materials`)
    } catch (e) {
      showError(e)
    } finally {
      setSubmitting(false)
    }
  }

  const canGenerate = basic.name.trim() !== '' && scene.locationMain.trim() !== ''

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={handleBack}
          className="p-1 rounded text-[var(--text)] hover:text-[var(--text-h)] hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <ArrowLeftIcon size={16} />
        </button>
        <h1 className="text-[16px] font-bold text-[var(--text-h)] m-0">素材を登録</h1>
      </div>

      <div className="flex flex-col gap-4">
        <BasicInfoSection
          values={basic}
          onChange={(updates) => setBasic((prev) => ({ ...prev, ...updates }))}
          groups={groups}
        />
        <SceneDescSection
          values={scene}
          onChange={(updates) => setScene((prev) => ({ ...prev, ...updates }))}
        />
        <VisualElementsSection
          values={visual}
          onChange={(updates) => setVisual((prev) => ({ ...prev, ...updates }))}
        />
      </div>

      <div className="flex justify-end gap-3 mt-5 pb-8">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 text-[13px] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate || submitting}
          className="px-5 py-2 text-[13px] font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {submitting ? '登録中...' : '素材を生成'}
        </button>
      </div>
    </div>
  )
}
