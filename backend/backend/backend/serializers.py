from rest_framework import serializers


class FileLinkSerializer(serializers.Serializer):
    link = serializers.URLField()
