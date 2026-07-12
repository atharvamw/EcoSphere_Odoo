"""
Root-level test file to import and trigger modular backend tests
when running tests from the global tests/ folder.
"""

# Import gamification tests
from apps.gamification.tests import (
    test_redeem_reward_success,
    test_redeem_reward_insufficient_points,
    test_redeem_reward_out_of_stock,
    test_redeem_reward_concurrency,
)

# Import scoring tests
from apps.scoring.tests import (
    test_scoring_engine_formulas,
    test_scoring_engine_default_weights,
)
