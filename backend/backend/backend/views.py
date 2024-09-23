from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from backend import serializers
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload
import uuid
from pathlib import Path


@api_view(['POST'])
def download_file(request):
    serializer = serializers.FileLinkSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    splitted_link = serializer.validated_data["link"].split("/")
    if len(splitted_link) < 6:
        print("Invalid Google Drive Link")
        return Response(data={"detail": "Invalid Google Drive Link"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        file_id = splitted_link[5]

    creds = service_account.Credentials.from_service_account_file(
        'secret.json',
        scopes=['https://www.googleapis.com/auth/drive']
    )
    try:
        # create Files dir if it doesn't exist
        Path("files/").mkdir(parents=True, exist_ok=True)

        # create drive api client
        service = build("drive", "v3", credentials=creds)

        # pylint: disable=maybe-no-member
        request = service.files().get_media(fileId=file_id)
        file = io.FileIO(
            f"files/{uuid.uuid4()}_{service.files().get(fileId=file_id, fields='name').execute()['name']}",
            mode='wb'
        )
        downloader = MediaIoBaseDownload(file, request)
        done = False
        while done is False:
            file_status, done = downloader.next_chunk()
            print(f"Download {int(file_status.progress() * 100)}%")

    except HttpError as error:
        print(f"An error occurred: {error}")
        return Response(data={"detail": "Invalid Google Drive Link: File Not Found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(status=status.HTTP_201_CREATED)
