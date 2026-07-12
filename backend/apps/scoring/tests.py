import pytest
from apps.scoring.services import ScoringEngine
from apps.core.models import SiteSettings

@pytest.mark.django_db
def test_scoring_engine_formulas():
    """
    Test that the scoring engine correctly weights environmental, social, 
    and governance inputs based on SiteSettings.
    """
    # Override settings for the test
    settings = SiteSettings.get_settings()
    settings.weight_environmental = 0.50
    settings.weight_social = 0.30
    settings.weight_governance = 0.20
    settings.save()
    
    # Inputs (normalized 0-100)
    env_score = 80.0
    soc_score = 60.0
    gov_score = 90.0
    
    # Expected: (80 * 0.5) + (60 * 0.3) + (90 * 0.2)
    #           40 + 18 + 18 = 76
    
    total = ScoringEngine.calculate_total_score(env_score, soc_score, gov_score)
    
    assert total == 76.0

@pytest.mark.django_db
def test_scoring_engine_default_weights():
    # Ensure default weights are E=40%, S=30%, G=30%
    settings = SiteSettings.get_settings()
    assert settings.weight_environmental == 0.40
    assert settings.weight_social == 0.30
    assert settings.weight_governance == 0.30
    
    total = ScoringEngine.calculate_total_score(100.0, 100.0, 100.0)
    assert total == 100.0
