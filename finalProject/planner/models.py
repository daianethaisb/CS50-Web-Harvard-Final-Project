from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Finance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userFinance") 
    title = models.CharField(max_length=40)
    description = models.CharField(max_length=120)
    concluded = models.BooleanField(null=True, default=False)
    entry = models.CharField(max_length=40)
    value = models.DecimalField(max_digits=11, decimal_places=2, default=0.0)
    finance_date = models.DateTimeField(null=True, auto_now=True) 
    category = models.CharField(max_length=40)

    def __unicode__(self):
        return self.title

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "concluded": self.concluded,
            "entry": self.entry,
            "value": self.value,
            "category": self.category,
            "timestamp": self.finance_date.strftime("%b %d %Y, %I:%M %p")
        }  

class Study(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userStudy") 
    course = models.CharField(max_length=40)
    description = models.CharField(max_length=120)
    concluded = models.BooleanField(null=True, default=False)
    study_date = models.DateTimeField(null=True, auto_now=True)  

    def __unicode__(self):
        return self.course

    def serialize(self):
        return {
            "id": self.id,
            "course": self.course,
            "description": self.description,
            "concluded": self.concluded,
            "timestamp": self.study_date.strftime("%b %d %Y, %I:%M %p")
        }  

class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userGoal")
    title = models.CharField(max_length=40)
    description = models.CharField(max_length=120) 
    priority = models.CharField(max_length=40)            
    concluded = models.BooleanField(default=False)
    goal_date = models.DateTimeField(null=True, auto_now=True)   

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "concluded": self.concluded,
            "timestamp": self.goal_date.strftime("%b %d %Y, %I:%M %p")
        } 

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="userComment")
    study = models.ForeignKey(Study, on_delete=models.CASCADE, blank=True, null=True, related_name="studyComment")
    comment = models.CharField(null=False, max_length=200)       
    comment_date = models.DateTimeField(null=True, auto_now=True)

    def __str__(self):
        return f"{self.author} comment on {self.study} - {self.comment_date}"
    
    def serialize(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "studyId": self.study.id,
            "timestamp": self.comment_date.strftime("%b %d %Y, %I:%M %p")
        }  