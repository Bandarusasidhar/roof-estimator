function calculateEstimate(config, answers) {

    const roofArea = Number(answers.roof_area);

    const getOption = (questionKey) => {
        const question = config.questions.find(
            q => q.key === questionKey
        );

        if (!question) {
            return null;
        }

        return question.options.find(
            option => option.value === answers[questionKey]
        );
    };

    const material = getOption("material");
    const pitch = getOption("pitch");
    const layers = getOption("layers");
    const stories = getOption("stories");

    if (!material || !pitch || !layers || !stories) {
        throw new Error("Invalid estimator answers");
    }

    const materialRate = Number(material.rate_per_sqft);
    const pitchMultiplier = Number(pitch.multiplier);
    const tearOffRate = Number(layers.tear_off_per_sqft);
    const storiesMultiplier = Number(stories.multiplier);

    const wasteFactor = Number(config.modifiers.waste_factor);
    const permitFee = Number(config.modifiers.permit_flat_fee);
    const spread = Number(config.modifiers.range_spread_pct) / 100;

    const baseMaterialCost =
        roofArea * materialRate * (1 + wasteFactor);

    const tearOffCost =
        roofArea * tearOffRate;

    const adjustedSubtotal =
        (baseMaterialCost + tearOffCost)
        * pitchMultiplier
        * storiesMultiplier;

    const midEstimate =
        adjustedSubtotal + permitFee;

    const estimateLow =
        Math.round(midEstimate * (1 - spread));

    const estimateHigh =
        Math.round(midEstimate * (1 + spread));

    return {
        estimate_low: estimateLow,
        estimate_high: estimateHigh
    };
}

module.exports = {
    calculateEstimate
};