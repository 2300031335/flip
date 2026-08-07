import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Trust Graph Platform - Multi-Actor Fraud Detection"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # JWT Security Config
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-trust-graph-jwt-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Remediation Risk Thresholds
    RISK_THRESHOLD_LOW: int = 30
    RISK_THRESHOLD_MEDIUM: int = 60
    RISK_THRESHOLD_HIGH: int = 80
    RISK_THRESHOLD_CRITICAL: int = 90
    
    # Database Config
    DATABASE_TYPE: str = os.getenv("DATABASE_TYPE", "sqlite")  # 'sqlite' or 'mysql'
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./trust_graph.db")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "password")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "trust_graph")
    
    # Redis Config
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))

settings = Settings()

