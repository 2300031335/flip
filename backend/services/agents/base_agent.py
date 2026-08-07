from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAgent(ABC):
    """
    Abstract Base Class for specialized AI Risk Agents in the Trust Graph Multi-Agent System.
    """
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    @abstractmethod
    def evaluate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        pass
