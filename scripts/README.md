# Scripts

Deployment and Docker volume management scripts. Shell scripts (`.sh`) for Linux/macOS and PowerShell scripts (`.ps1`) for Windows.

## Scripts

| Script | Description |
|--------|-------------|
| `deploy.sh` | Production deployment. Stops all containers, clones/pulls the repo, copies `.env`, optionally restores volume backups (`--db` flag), then builds and starts Docker Compose. Used by the GitHub Actions CI/CD pipeline via SSH. |
| `run.ps1` | Starts the Docker Compose stack from the repo root. Windows convenience wrapper. |
| `vbak.sh` / `vbak.ps1` | Backs up Docker volumes (PostgreSQL, MinIO, pgAdmin) as `.tar.gz` archives into `docker_backups/`. Prompts for confirmation before running. |
| `vres.sh` / `vres.ps1` | Restores Docker volumes from `docker_backups/` archives. Stops affected containers, restores data, then restarts. Supports `--skip` flag to bypass confirmation (used by `deploy.sh`). |

## Usage

### Deploy to production

```bash
# Triggered automatically by GitHub Actions on push to backend-master.
# Manual run on the VM:
bash scripts/deploy.sh        # Without volume restore
bash scripts/deploy.sh --db   # With volume restore from backup
```

### Back up volumes

```bash
bash scripts/vbak.sh
# Creates docker_backups/ascend_postgres_data.tar.gz, ascend_minio_data.tar.gz, ascend_pgadmin_data.tar.gz
```

### Restore volumes

```bash
bash scripts/vres.sh
# Restores from docker_backups/ directory
```

### Start stack (Windows)

```powershell
.\scripts\run.ps1
```
