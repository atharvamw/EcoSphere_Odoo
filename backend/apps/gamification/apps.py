from django.apps import AppConfig


class GamificationConfig(AppConfig):
    name = 'apps.gamification'

    def ready(self):
        import apps.gamification.signals
