from .views import CommitViewSet, RepositoryViewSet

routes = [
    { 'regex': r'commits', 'viewset': CommitViewSet, 'basename': 'Commit' },
    { 'regex': r'repositories', 'viewset': RepositoryViewSet, 'basename': 'Repository' },
]