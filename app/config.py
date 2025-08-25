from pydantic import Field
from pydantic_settings import SettingsConfigDict, BaseSettings

class Settings(BaseSettings):
    """
    Application settings
    """
    sink_dir: str = Field("/app/sink", description="Directory to store files")

    model_config = SettingsConfigDict(
        env_prefix="",        # No prefix → looks for SINK_DIR
        case_sensitive=True,  # Environment variable names are case-sensitive
        env_file=".env",      # Optional: read values from .env
        env_file_encoding="utf-8"
    )

# Instantiate settings
settings = Settings()

