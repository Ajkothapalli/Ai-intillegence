import { getNextSpotlight } from '../spotlightLogic'
import { SpotlightOverlay } from './SpotlightOverlay'

export async function SpotlightController() {
  const spotlight = await getNextSpotlight()
  if (!spotlight) return null
  return <SpotlightOverlay spotlight={spotlight} />
}
