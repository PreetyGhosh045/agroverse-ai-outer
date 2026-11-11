import { useState } from 'react'
import useLabels from '../../hooks/useLabels'
import { seasons, seasonMeta, cropOptions, cropsBySeason, cropEmoji } from '../../data/crops'

// Crop Recommendation - the same section is used on the landing page (no login needed)
// and inside the dashboard.
export default function CropRecommendation() {
  const { t, tCrop, cropLabel } = useLabels()
  const [selectedRecommendationSeason, setSelectedRecommendationSeason] = useState('');
  const [selectedRecommendationCrops, setSelectedRecommendationCrops] = useState([]);
  const [recommendation, setRecommendation] = useState(null)
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false)

  const getRecommendation = async () => {
    setIsLoadingRecommendation(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    if (!selectedRecommendationSeason) {
      setRecommendation({ kind: 'noSeason' })
      setIsLoadingRecommendation(false)
      return
    }

    if (selectedRecommendationCrops.length === 0) {
      setRecommendation({ kind: 'noCrops' })
      setIsLoadingRecommendation(false)
      return
    }

    setRecommendation({
      kind: 'ok',
      season: selectedRecommendationSeason,
      crops: selectedRecommendationCrops,
    })

    setIsLoadingRecommendation(false)
  }

  return (
    <section className="crop-recommendation">
      <h2 id="crop-recommendation">{t('nav.cropRecommendation')}</h2>
      <p>{t('recommendation.subtitle')}</p>

      <div className="profile-card">
        <h3>🌾 {t('recommendation.cardTitle')}</h3>

        <label>{t('recommendation.season')}</label>
        <div className="crop-grid">
          {seasons.map((season) => (
            <button
              key={season}
              type="button"
              className={
                selectedRecommendationSeason === season
                  ? "crop-option selected"
                  : "crop-option"
              }
              onClick={() => {
                setSelectedRecommendationSeason(season);
                setSelectedRecommendationCrops([]);
              }}
            >
              {selectedRecommendationSeason === season ? "✅ " : seasonMeta[season].emoji + " "}
              {t('seasons.' + season)}
            </button>
          ))}
        </div>

        {selectedRecommendationSeason && (
          <>
            <label>{seasonMeta[selectedRecommendationSeason].emoji} {t('recommendation.cropsSuitable', { season: t('seasons.' + selectedRecommendationSeason) })}</label>
            <div className="crop-grid">
              {cropOptions
                .filter((crop) => cropsBySeason[selectedRecommendationSeason].includes(crop.en))
                .map((crop) => (
                  <button
                    key={crop.en}
                    type="button"
                    className={
                      selectedRecommendationCrops.includes(crop.en)
                        ? "crop-option selected"
                        : "crop-option"
                    }
                    onClick={() =>
                      setSelectedRecommendationCrops((prev) =>
                        prev.includes(crop.en)
                          ? prev.filter((c) => c !== crop.en)
                          : [...prev, crop.en]
                      )
                    }
                  >
                    {selectedRecommendationCrops.includes(crop.en) ? "✅ " : cropEmoji[crop.en] + " "}
                    {cropLabel(crop)}
                  </button>
                ))}
            </div>
          </>
        )}

        <p>
          {t('common.selectedCrops')}: <strong>{selectedRecommendationCrops.length}</strong>
        </p>

        <button onClick={getRecommendation} disabled={isLoadingRecommendation}>
          {isLoadingRecommendation ? t('recommendation.loading') : t('recommendation.get')}
        </button>

        {recommendation && (
          <div className={`recommendation-result ${recommendation.kind !== 'ok' ? 'recommendation-warning' : ''}`}>
            <h3>🌱 {t('recommendation.inputTitle')}</h3>
            <p>
              {recommendation.kind === 'noSeason'
                ? `⚠️ ${t('recommendation.noSeason')}`
                : recommendation.kind === 'noCrops'
                  ? `⚠️ ${t('recommendation.noCrops')}`
                  : t('recommendation.result', {
                      season: t('seasons.' + recommendation.season),
                      crops: recommendation.crops.map(tCrop).join(', '),
                    })}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
