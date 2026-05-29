"""
Repository paths for SymbioMarket (works on Windows, WSL, macOS).

Use this instead of hardcoded /mnt/c/... paths.
"""
from __future__ import annotations

from pathlib import Path


def symbio_root() -> Path:
    """Directory that contains ``agents/`` and ``swarm_data.json``."""
    return Path(__file__).resolve().parent.parent


def swarm_data_path() -> Path:
    return symbio_root() / "swarm_data.json"


def ensure_repo_root_on_syspath() -> None:
    """So ``import agents....`` works when the repo root is on ``sys.path``."""
    import sys

    root = str(symbio_root())
    if root not in sys.path:
        sys.path.insert(0, root)
