import datetime

from rest_framework import status
from rest_framework.response import Response

from .serializers import CommitSerializer


# Parser for the structure of commits used in the webhook
def webhook_commit_parser(raw_commit):
    try:
        parsed_commit = {
            'code': raw_commit['id'],
            'url': raw_commit['url'],
            'date': raw_commit['timestamp'],
            'message': raw_commit['message'],
        }
    except KeyError:
        return None
    return parsed_commit


# Parser for the structure of commits used in the bulk insert
def bulk_insert_commit_parser(raw_commit):
    try:
        parsed_commit = {
            'code': raw_commit['sha'],
            'url': raw_commit['html_url'],
            'date': raw_commit['commit']['author']['date'],
            'message': raw_commit['commit']['message'],
        }
    except KeyError:
        return None
    return parsed_commit


# Auxiliary method that saves multiple commits from an array into
# the database and returns the added data in a HTTP Response
def save_multiple_commits(commits, repository_id, parser_func):
    new_commits = []
    # Loop through the commits that were received from the GitHub
    # API, process them and save the result in the database
    for raw_commit in commits:
        # Parse the commits using the function passed as a parameter
        parsed_commit = parser_func(raw_commit)
        if parsed_commit:
            # Python 3.7 can't parse UTC's offset Z at the end of the string,
            # so we manually replace it with the numerical offset +00:00
            created_at = parsed_commit['date'].replace('Z', '+00:00')
            commit = {
                'code': parsed_commit['code'],
                'url': parsed_commit['url'],
                'repository_id': repository_id,
                'message': parsed_commit['message'],
                'date': datetime.datetime.fromisoformat(created_at),
            }
            serializer = CommitSerializer(data=commit)
            serializer.is_valid()
            # Simply don't add commits that are already present in the database
            if serializer.validated_data:
                instance = serializer.save()
                new_commits.append(instance)
    # Serialize the new commits to return them in the response
    serializer = CommitSerializer(new_commits, many=True)
    status_code = status.HTTP_201_CREATED
    # If no commits were added in this request, we return a
    # more proper status code instead of 201
    if not new_commits:
        status_code = status.HTTP_200_OK
    return Response(serializer.data, status=status_code)
