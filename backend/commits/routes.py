from .views import CommitViewSet, RepositoryViewSet

routes = [
    (r'commits', CommitViewSet),
    (r'repositories', RepositoryViewSet),
]