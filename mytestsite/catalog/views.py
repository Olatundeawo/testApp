from django.shortcuts import render
from rest_framework import viewsets
from django.http import JsonResponse
from .models import Test, Question, Answer, UserAnswer
from .serilalizers import TestSerializer, QuestionSerializer, AnswerSerializer, UserAnswerSerializer

def ping(request):
    return (JsonResponse({"status": "ok"}))

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class UserAnswerViewSet(viewsets.ModelViewSet):
    queryset = UserAnswer.objects.all()
    serializer_class = UserAnswerSerializer