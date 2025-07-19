from django.urls import path, include   
from rest_framework.routers import DefaultRouter
from .views import TestViewSet, QuestionViewSet, AnswerViewSet, UserAnswerViewSet, ping

router = DefaultRouter()
router.register(r'tests', TestViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'user-answers', UserAnswerViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('ping/', ping)
]

