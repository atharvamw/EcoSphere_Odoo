from apps.core.models import SiteSettings

class ScoringEngine:
    @staticmethod
    def calculate_total_score(env_score: float, soc_score: float, gov_score: float) -> float:
        """
        Calculates the total ESG score using weights from SiteSettings.
        Inputs should be normalized 0-100.
        Returns the weighted total score.
        """
        settings = SiteSettings.get_settings()
        
        total = (
            (env_score * settings.weight_environmental) +
            (soc_score * settings.weight_social) +
            (gov_score * settings.weight_governance)
        )
        
        return round(total, 2)
