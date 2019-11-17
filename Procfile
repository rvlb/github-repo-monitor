web: gunicorn github_repo_monitor.wsgi --chdir backend --limit-request-line 8188 --log-file -
worker: celery worker --workdir backend --app=github_repo_monitor --loglevel=info
