import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt

from .models import Finance, Goal, Study, Comment, User

def index(request):
    if not request.user.is_authenticated:
        return render(request, "planner/login.html")
    else:

        finance_ = Finance.objects.filter(user=request.user.id).order_by("id").all()
        study_ = Study.objects.filter(user=request.user.id).order_by("id").all()
        goal_ = Goal.objects.filter(user=request.user.id).order_by("id").all()

        if len(finance_) == 0:
            finance = finance_
        else:
            finance = Finance.objects.filter(user=request.user.id).order_by("id").reverse()[0]

        if len(study_) == 0:
            study = study_
        else:
            study = Study.objects.filter(user=request.user.id).order_by("id").reverse()[0]

        if len(goal_) == 0:
            goal = goal_
        else:
            goal = Goal.objects.filter(user=request.user.id).order_by("id").reverse()[0]

        return render(request, "planner/index.html",{
            "finance": finance,
            "study": study,
            "goal": goal,
        })


def login_view(request):
    if request.method == "POST":

        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "planner/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "planner/login.html")


def logout_view(request):
    logout(request)
    return render(request, "planner/login.html")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "planner/register.html", {
                "message": "Passwords must match."
            })

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "planner/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "planner/register.html")

@login_required
def finance(request):
    search = request.GET.get('search')
    if search:
        finances = Finance.objects.filter(user=request.user.id, title=search).order_by("id").reverse()
        allFinances_ = finances.filter(title__icontains=search)
    else:
        search=""
        allFinances_ = Finance.objects.filter(user=request.user.id).order_by("id").reverse()

    entryFinances_ = allFinances_.filter(entry="entry")
    exitFinances_ = allFinances_.filter(entry="exit")
    pendingFinances_ = allFinances_.exclude(concluded=True)

    p = Paginator(allFinances_, 6)
    page_number = request.GET.get('page')
    allFinances = p.get_page(page_number)

    p = Paginator(entryFinances_, 6)
    page_number = request.GET.get('page')
    entryFinances = p.get_page(page_number)

    p = Paginator(exitFinances_, 6)
    page_number = request.GET.get('page')
    exitFinances = p.get_page(page_number)

    p = Paginator(pendingFinances_, 6)
    page_number = request.GET.get('page')
    pendingFinances = p.get_page(page_number)

    return render (request, "planner/finance.html", {
        "allFinances": allFinances,
        "entryFinances": entryFinances,
        "exitFinances": exitFinances,
        "pendingFinances": pendingFinances,
        "allFinancesCount": allFinances_.count,
        "entryFinancesCount": entryFinances_.count,
        "exitFinancesCount": exitFinances_.count,
        "pendingFinancesCount": pendingFinances_.count,
        "search": search
    }) 

def createFinance(request):
    if request.method == "POST":
        
        newFinance = Finance()
        newFinance.user = User.objects.get(pk=request.user.id)
        newFinance.title = request.POST.get("title")
        newFinance.description = request.POST.get("description")
        newFinance.concluded = request.POST.get("concluded")
        newFinance.entry = request.POST.get("entry")
        newFinance.value = request.POST.get("value")
        newFinance.category = request.POST.get("category")

        newFinance.save()
        return HttpResponseRedirect(reverse("finance"))
    else:
        return HttpResponse(status=405)
    
def editFinance(request, financeId):
    
    if request.method == "POST":
        finance = Finance.objects.get(pk=financeId)
        finance.description = request.POST.get("modalEditContent")
        finance.value = request.POST.get("valueEdit")

        finance.save()
        return HttpResponseRedirect(reverse("finance"))
    else:
        return HttpResponse(status=405)
    
def changePending(request, financeId):

    if request.method == "POST":
        data = json.loads(request.body)
        concluded = data["concluded"]

        changePending = Finance.objects.get(pk=financeId)
        changePending.concluded = concluded
        finance = changePending
        changePending.save()

        return JsonResponse(finance.serialize())
    else:
        return HttpResponse(status=405)
    
def removeFinance(request, financeId):
    if request.method == "GET":
        return HttpResponse(status=405)
    
    if request.method == "POST":
        try:
            finance_obj = Finance.objects.get(pk=financeId)
        except finance_obj.DoesNotExist:
            return HttpResponse(status=404)
        else:
            finance_obj.delete()
    return HttpResponseRedirect(reverse("finance"))

@login_required
def study(request):
    search = request.GET.get('search')

    if search:
        courses = Study.objects.filter(user=request.user.id, course=search).order_by("id").reverse()
        allCourses_ = courses.filter(course__icontains=search)
    else:
        search=""
        allCourses_ = Study.objects.filter(user=request.user.id).order_by("id").reverse()

    p = Paginator(allCourses_, 6)
    page_number = request.GET.get('page')
    allCourses = p.get_page(page_number)

    comments = Comment.objects.filter(author=request.user.id).order_by("id").reverse()

    return render (request, "planner/study.html", {
        "allCourses": allCourses,
        "search": search,
        "comments": comments
    }) 

def createStudy(request):
    if request.method == "POST":
        data = json.loads(request.body)
        newStudy = Study()
        newStudy.user = User.objects.get(pk=request.user.id)
        newStudy.course = data["name"]
        newStudy.description = data["description"]
        concluded = data["completed"]

        if concluded == "True":
            concluded = True
        else:
            concluded = False

        newStudy.concluded = concluded
        course = newStudy
        newStudy.save()

        return JsonResponse(course.serialize())
    else:
        return HttpResponse(status=405)

def changeStudyConcluded(request, studyId):

    if request.method == "POST":
        data = json.loads(request.body)
        concluded = data["concluded"]

        changeConcluded = Study.objects.get(pk=studyId)
        changeConcluded.concluded = concluded
        changeChecked = changeConcluded.concluded
        changeConcluded.save()

        return JsonResponse({"message": "edited successfully", "changeChecked": changeChecked})
    else:
        return HttpResponse(status=405)

@csrf_exempt
def editStudy(request, studyId):
    if request.method == "POST":
        
        study = Study.objects.get(pk=studyId)
        study.description = request.POST.get("modalEditContent")

        study.save()
        return HttpResponseRedirect(reverse("study"))
    else:
        return HttpResponse(status=405)
     
def commentStudy(request, studyId):
    if request.method == "POST":
        data = json.loads(request.body)
        newComment = Comment()
        newComment.author = User.objects.get(pk=request.user.id)
        newComment.study = Study.objects.get(pk=studyId)
        newComment.comment = data["comment"]

        comment = newComment
        newComment.save()

        return JsonResponse(comment.serialize())
    else:
        return HttpResponse(status=405)

@csrf_exempt
def removeStudy(request, studyId):
    if request.method == "GET":
        return HttpResponse(status=405)
    
    if request.method == "POST":
        try:
            study_obj = Study.objects.get(pk=studyId)
        except study_obj.DoesNotExist:
            return HttpResponse(status=404)
        else:
            study_obj.delete()
    return HttpResponseRedirect(reverse("study"))

@login_required
def goal(request):
   
    allgoals_ = Goal.objects.filter(user=request.user.id).order_by("id").reverse()
    concludedGoals_ = allgoals_.filter(concluded=True)
    inprogressdGoals_ = allgoals_.filter().exclude(concluded=True)

    p = Paginator(concludedGoals_ , 4)
    page_number = request.GET.get('page')
    concludedGoals = p.get_page(page_number)

    p = Paginator(inprogressdGoals_ , 4)
    page_number = request.GET.get('page')
    inprogressGoals = p.get_page(page_number)

    return render (request, "planner/goal.html", {
        "allGoals": inprogressGoals,
        "concludedGoals": concludedGoals,
    }) 

def createGoal(request):
    if request.method == "POST":
        data = json.loads(request.body)
        newgoal = Goal()
        newgoal.user = User.objects.get(pk=request.user.id)
        newgoal.title = data["title"]
        newgoal.description = data["description"]
        newgoal.priority = data["priority"]
        concluded = data["completed"]

        if concluded == "True":
            concluded = True
        else:
            concluded = False

        newgoal.concluded = concluded
        goal = newgoal
        newgoal.save()

        return JsonResponse(goal.serialize())
    else:
        return HttpResponse(status=405)

def changeGoalConcluded(request, goalId):
    if request.method == "POST":
        data = json.loads(request.body)
        concluded = data["concluded"]

        changegoalPending = Goal.objects.get(pk=goalId)
        changegoalPending.concluded = concluded
        goal = changegoalPending
        changegoalPending.save()

        return JsonResponse(goal.serialize())
    else:
        return HttpResponse(status=405)

def editGoal(request, goalId):
    if request.method == "POST":
        goal = Goal.objects.get(pk=goalId)
        goal.description = request.POST.get("modalEditContent")

        goal.save()
        return HttpResponseRedirect(reverse("goal"))
    else:
        return HttpResponse(status=405)

@csrf_exempt
def removeGoal(request, goalId):
    if request.method == "GET":
        return HttpResponse(status=405)
    
    if request.method == "POST":
        try:
            goal_obj = Goal.objects.get(pk=goalId)
        except goal_obj.DoesNotExist:
            return HttpResponse(status=404)
        else:
            goal_obj.delete()
    return HttpResponseRedirect(reverse("goal"))

        