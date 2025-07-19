from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse

class Test(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    minutes = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    image = models.ImageField(upload_to='questions/', null=True, blank=True)

    def __str__(self):
        return f"Q:{self.text[:50]}"
    
class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"A:{self.text[:50]}"
    
class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='user_answers')
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='user_answers')
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"UA:{self.user.username} - {self.question.text[:50]}"
    
