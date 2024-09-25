import os

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from backend import serializers
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from pathlib import Path
import threading
from backend.models import MyFile
from backend.utils import download_manager


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
        drive_filename = service.files().get(fileId=file_id, fields='name').execute()['name']

        file_record = MyFile()
        file_record.save()
        threading.Thread(target=download_manager.save_file, args=(request, file_record.id, drive_filename)).start()
        print("Thread already running")

    except HttpError as error:
        print(f"An error occurred: {error}")
        return Response({"detail": "Invalid Google Drive Link: File Not Found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"file_id": file_record.id}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_download_status(request, file_id: int):
    download_progress = download_manager.get_file_status_progress(file_id)
    if download_progress is None:
        return Response({"detail": "File Not Currently Downloading"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"progress": download_progress}, status=status.HTTP_200_OK)
