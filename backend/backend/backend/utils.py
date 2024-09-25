import io
from googleapiclient.http import MediaIoBaseDownload


class DownloadManager:
    file_status_by_file_id = dict()

    def save_file(self, request, file_id, drive_filename):
        file = io.FileIO(f"files/{file_id}_{drive_filename}", mode='wb')
        downloader = MediaIoBaseDownload(file, request, chunksize=2 * 1024 * 1024)
        done = False
        self.file_status_by_file_id[file_id] = 0
        while done is False:
            file_status, done = downloader.next_chunk()
            self.file_status_by_file_id[file_id] = int(file_status.progress() * 100)
            print(f"Download {int(file_status.progress() * 100)}%. Removing from dict")

    def get_file_status_progress(self, file_id):
        progress = self.file_status_by_file_id.get(file_id)
        if progress == 100:
            del self.file_status_by_file_id[file_id]
        return progress


download_manager = DownloadManager()
