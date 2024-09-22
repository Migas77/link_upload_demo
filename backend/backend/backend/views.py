import requests
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from backend import serializers


@api_view(['POST'])
def download_file(request):
    serializer = serializers.FileLinkSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    link = serializer.validated_data["link"]
    print(requests.get(link).content)
    return Response(status=status.HTTP_201_CREATED)
