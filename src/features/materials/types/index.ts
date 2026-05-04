export interface MaterialBasicForm {
  name: string
  groupId: string
  description: string
  aspectRatio: string
  artStyle: string
}

export interface MaterialSceneForm {
  locationMain: string
  locationDetail: string
  worldSetting: string
  timeSlot: string
  weather: string
  skyDesc: string
  lighting: string
}

export interface MaterialVisualForm {
  fgLStructure: string
  fgLTexture: string
  fgLFurniture: string
  fgLProps: string
  mgCGround: string
  mgCDecoration: string
  mgCAtmosphere: string
  mgRStructure: string
  mgRItems: string
  bgBuilding: string
  bgTerrain: string
}
