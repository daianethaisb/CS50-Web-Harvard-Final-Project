from django.contrib import admin
from .models import Finance, Study, Comment, Goal, User

admin.site.register(Finance)
admin.site.register(Study)
admin.site.register(Comment)
admin.site.register(Goal)
admin.site.register(User)
