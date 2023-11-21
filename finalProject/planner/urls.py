
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("finance", views.finance, name="finance"),
    path("study", views.study, name="study"),
    path("goal", views.goal, name="goal"),
    path("createFinance", views.createFinance, name="createFinance"),
    path("changePending/<int:financeId>", views.changePending, name="changePending"),
    path("editFinance/<int:financeId>", views.editFinance, name="editFinance"),
    path("removeFinance/<int:financeId>", views.removeFinance, name="removeFinance"),
    path("createStudy", views.createStudy, name="createStudy"),
    path("changeStudyConcluded/<int:studyId>", views.changeStudyConcluded, name="changeStudyConcluded"),
    path("editStudy/<int:studyId>", views.editStudy, name="editStudy"),
    path("commentStudy/<int:studyId>", views.commentStudy, name="commentStudy"),
    path("removeStudy/<int:studyId>", views.removeStudy, name="removeStudy"),
    path("createGoal", views.createGoal, name="createGoal"),
    path("changeGoalConcluded/<int:goalId>", views.changeGoalConcluded, name="changeGoalConcluded"),
    path("editGoal/<int:goalId>", views.editGoal, name="editGoal"),
    path("removeGoal/<int:goalId>", views.removeGoal, name="removeGoal")
]