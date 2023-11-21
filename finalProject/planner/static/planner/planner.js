// Shows one page and hides the other three
function showPage(page) {
    document.querySelectorAll('.card_finances').forEach(div => {
        div.style.display = 'none';
    });
    document.querySelector(`#${page}`).style.display = 'block';
}

// Wait for page to loaded:
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btnMenu').forEach(button => {
        button.onclick = function() {
            showPage(this.dataset.page);
        }
    })
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


// Change the finance status to pending/complete. 
// Both 4 finance categories use this function, passing the ID and the identifier of the corresponding category as a parameter:
function changePending(id,event){
    let checkbox;
    let isChecked;

    if(event == 1){
        checkbox = document.getElementById(`changePendingAll_${id}`);
        isChecked = checkbox.checked;
    }else if (event == 2){
        checkbox = document.getElementById(`changePendingEntry_${id}`);
        isChecked = checkbox.checked;
    }else if (event == 3){
        checkbox = document.getElementById(`changePendingExit_${id}`);
        isChecked = checkbox.checked;
    }else if (event == 4){
        checkbox = document.getElementById(`changePending_${id}`);
        isChecked = checkbox.checked;
    }

    if (isChecked) {
        checkbox.value="True"
    } else {
        checkbox.value="False"
    }

    let financeId = id;
    let csrftoken = getCookie('csrftoken')
    let checked  = checkbox.value;

    fetch(`changePending/${financeId}`, {
        method: "POST",
        body: JSON.stringify({
            id: financeId,
            concluded: checked,
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .then(response => response.json())
    .then(finance => {

        if (finance.concluded == "True") {

            document.querySelectorAll(`.textPending_${id}`).forEach(text =>{
                text.innerHTML = "Mark as Pending"
            })
            document.querySelectorAll(`.changePending_${id}`).forEach(checkbox =>{
                checkbox.checked = true
            })

            cardRemove = document.getElementById(`cardPending_${id}`);
            countRemove = document.getElementById('countPending');
            r = countRemove.innerHTML
            countRemove.innerHTML = r - 1;
            cardRemove.remove();
            
        } else {

            countRemove = document.getElementById('countPending');
            r = countRemove.innerHTML
            countRemove.innerHTML =parseInt(r)+ 1;

            document.querySelectorAll(`.textPending_${id}`).forEach(text =>{
                text.innerHTML = "Mark as Closed"
            })

            document.querySelectorAll(`.changePending_${id}`).forEach(checkbox =>{
                checkbox.checked = false
            })

            const element = document.createElement('div');
            element.className = "card_finance";
            element.innerHTML = `
                <div class="card" id="cardPending_${finance.id}">
                    <div class="card-body">
                        <h5 class="card-title">${finance.title}</h5>
                        <p class="card-text">${finance.description}</p>
                        <div>Value: ${finance.value}</div>
                        <div>Category: ${finance.category}</div>
                        <div style="color: green" id="entryTipe_${finance.id}">Entry</div>
                        <div class="row">
                            <div class="main col-lg-2">
                                <small>${finance.timestamp}</small><br>
                            </div>
                            <div class="sidebar col-lg-4">
                                <div class="form-check">
                                    <input class="form-check-input changePending_${finance.id}" type="checkbox" value="True" id="changePending_${finance.id}" data-mdb-toggle="modal" data-mdb-target="#confirmModal_${finance.id}"/>
                                    <label class="form-check-label" for="changePending_${finance.id}">Finished</label>
                                    <div class="form-helper textPending_${finance.id}">Mark as Closed</div>
                                </div>
                            </div>
                        </div>
                        <form action="{% url 'removeFinance' ${finance.id} %}"  method="POST">
                            <button type="button" class="btn btn-primary" data-mdb-toggle="modal" data-mdb-target="#editModalAll_${finance.id}">
                                Edit Description
                            </button>
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </div>
                </div>

                <div class="modal fade" id="confirmModal_${finance.id}" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="confirmLabel">Confirm Change</h5>
                                <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">Do you want to change the pending status of this finance?</div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal" onclick="checkCancelPending(${finance.id}, 4)">Cancel</button>
                                <button type="button" class="btn btn-primary" data-mdb-dismiss="modal" onclick="changePending(${finance.id}, 4)">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="editModal_${finance.id}" tabindex="-1" aria-labelledby="editFinanceLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <form action="{% url 'editFinance' ${finance.id} %}"  method="POST">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="editFinanceLabel">${finance.title}</h5>
                                    <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="form-outline">
                                        <textarea class="form-control" name="modalEditContent" id="salveEdit_${finance.id}" rows="4" data-mdb-showcounter="true" maxlength="120">${finance.description}</textarea>
                                        <label class="form-label" for="salveEdit_${finance.id}">Description</label>
                                        <div class="form-helper"></div>
                                    </div><br>
                                    <div class="form-outline">
                                        <input type="number" name="valueEdit" id="valueFinanceEdit" class="form-control" value="${finance.value}"/>
                                        <label class="form-label" for="valueFinanceEdit">Value</label>
                                    </div><br>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary">Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                `;

            document.querySelector('#cardFinance').append(element);
            concludedText = document.getElementById(`entryTipe_${course.id}`)
            concludedText.style = finance.entry == 'entry' ? 'color: green' : 'color: red';
            concludedText.innerHTML = finance.entry == 'entry' ? "Entry" : "Exit";
        }
    })
}

// Create a new study note.
function newStudy(){
    let courseName = document.getElementById("courseName").value
    let courseDescription = document.getElementById("courseDescription").value
    let courseCompleted = document.getElementById("courseCompleted").value
    let csrftoken = getCookie('csrftoken')

    fetch('createStudy', {
        method: "POST",
        body: JSON.stringify({
            name: courseName, 
            description: courseDescription,
            completed: courseCompleted,
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .then(response => response.json())
    .then(course => {

        const element = document.createElement('div');
        element.className = "card_study";
        element.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${course.course}</h5>
                    <p class="card-text">${course.description}</p>
                    <div style="color: green" id="studyProgress_${course.id}">Completed</div>
                    <div class="row">
                        <div class="main col-lg-4">
                            <small>${course.timestamp}</small><br>
                        </div>
                        <div class="sidebar col-lg-6">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="True" id="changeStudyConcluded_${course.id}" data-mdb-toggle="modal" data-mdb-target="#confirmModal_${course.id}"/>
                                <label class="form-check-label" for="changeStudyConcluded_${course.id}">Finished</label>
                                <div class="form-helper" id="changeStudyConcludedText_${course.id}">Mark as Complete</div>
                            </div>
                        </div>
                    </div>
                    <form action="{% url 'removeStudy' ${course.id} %}"  method="POST">
                        <button type="button" class="btn btn-primary" data-mdb-toggle="modal" data-mdb-target="#editModal_${course.id}">
                            Edit Description
                        </button>
                        <button type="submit" class="btn btn-danger">Delete</button>
                        <button type="button" class="btn btn-primary btn-floating btn-lg" data-mdb-toggle="modal" data-mdb-target="#notesModal_${course.id}" style="margin-left: 14px">
                            <i class="fa-brands fa-readme fa-flip-horizontal fa-xl" style="color: #232552;"></i>
                        </button>
                    </form>
                </div>
            </div>

            <div class="modal fade" id="notesModal_${course.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Title</h5>
                            <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-2">
                                <div class="form-outline">
                                    <input type="text" id="formComment_${course.id}" class="form-control" />
                                    <label class="form-label" for="formComment_${course.id}">Comment</label>
                                </div>
                                <button type="button" class="btn btn-primary btn-new-blue" style="float: right; margin-top: 6px" onclick="addCommentStudy(${course.id})"> Add New Comment </button>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <p class="card-text">
                                        <div class="comment-section mb-4">
                                            <div id="addCommentModal_${course.id}""></div>
                                        </div>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="confirmModal_${course.id}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmLabel">Confirm Change</h5>
                            <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">Do you want to change the pending status of this course?</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal" onclick="checkCancel(${course.id})">Cancel</button>
                            <button type="button" class="btn btn-primary" data-mdb-dismiss="modal" onclick="changeConcluded(${course.id}, 1)">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="editModal_${course.id}" tabindex="-1" aria-labelledby="editStudyLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form action="{% url 'editStudy' ${course.id} %}"  method="POST">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editStudyLabel">${course.course}</h5>
                                <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="form-outline">
                                    <textarea class="form-control" name="modalEditContent" id="salveEdit_${course.id}}" rows="4" data-mdb-showcounter="true" maxlength="120">${course.description}</textarea>
                                    <label class="form-label" for="salveEdit_${course.id}">Description</label>
                                    <div class="form-helper"></div>
                                </div><br>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            `;

        document.querySelector('#cardStudy').append(element);
        concludedText = document.getElementById(`studyProgress_${course.id}`)
        concludedText.style = course.concluded ? 'color: green' : 'color: red';
        concludedText.innerHTML = course.concluded ? "Completed" : "In progress";

        if(course.concluded){
            checkbox = document.getElementById(`changeStudyConcluded_${course.id}`)
            concluded = document.getElementById(`changeStudyConcludedText_${course.id}`)
            checkbox.checked = true
            concluded.innerHTML = "Mark as Pending"
        }

        document.getElementById("courseName").value = ""
        document.getElementById("courseDescription").value  = ""
        document.getElementById("courseCompleted").checked = false
        document.getElementById("courseCompleted").value= "False"
    })
}

// Changes the completion status of a study to completed/in progress.
function changeStudyConcluded(id){

    const checkbox = document.getElementById(`changeStudyConcluded_${id}`);
    const isChecked = checkbox.checked;

    if (isChecked) {
        checkbox.value="True"
    } else {
        checkbox.value="False"
    }

    const changeId = id;
    const checked  = checkbox.value;
    let csrftoken = getCookie('csrftoken')
    
    fetch(`changeStudyConcluded/${changeId}`, {
        method: "POST",
        body: JSON.stringify({
            concluded: checked,
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .then(response => response.json())
    .then(result =>  {

        const concludedText = document.getElementById(`studyProgress_${changeId}`)
        
        if(result.changeChecked == "True"){
            const concluded = document.getElementById(`changeStudyConcludedText_${changeId}`)
            concluded.innerHTML = "Mark as Pending"
            checkbox.checked = true
            concludedText.style = 'color: green';
            concludedText.innerHTML = "Completed" ;
        }else{
            const concluded = document.getElementById(`changeStudyConcludedText_${changeId}`)
            concluded.innerHTML = "Mark as Closed"
            checkbox.checked = false
            concludedText.style = 'color: red';
            concludedText.innerHTML = "In progress" ;
        }
    })
}

// Adds a new comment/note to a study.
function addCommentStudy(id){

    let studyId = id;
    let csrftoken = getCookie('csrftoken')
    let comment = document.getElementById(`formComment_${studyId}`).value
    
    fetch(`commentStudy/${studyId}`, {
        method: "POST",
        body: JSON.stringify({
            id: studyId,
            comment: comment,
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .then(response => response.json())
    .then(comment => {
        
        const element = document.createElement('div');
        element.className = "single-comment mb-3";
        element.innerHTML = 
        `<div class="comment-text">
            ${comment.comment}    
        </div>
        <small>${comment.timestamp}</small>`

        document.querySelector(`#addCommentModal_${comment.studyId}`).append(element);
        document.getElementById(`formComment_${studyId}`).value="";
    })
}

// Create a new objective note.
function newGoal(){
    const goalTitle = document.getElementById("goalTitle").value
    const goalDescription = document.getElementById("goalDescription").value
    const goalCompleted = document.getElementById("goalConcluded").value
    const goalPriority = document.getElementById("goalPriority").value
    let csrftoken = getCookie('csrftoken')

    fetch('createGoal', {
        method: "POST",
        body: JSON.stringify({
            title: goalTitle, 
            description: goalDescription,
            completed: goalCompleted,
            priority: goalPriority,
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .then(response => response.json())
    .then(goal => {

        const element = document.createElement('div');

        if(goal.concluded){

            element.className = "card_goal";
            element.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${goal.title}</h5>
                        <p class="card-text">${goal.description}</p>
                        <div style="color: green" id="goalProgress_${goal.id}">Completed</div>
                        <small>${goal.timestamp}</small><br>
                        <small style="font-weight: bold;">Priority: ${goal.priority}</small><br>

                        <form action="{% url 'removeGoal' ${goal.id} %}"  method="POST">
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </div>
                </div>`;

            document.querySelector('#cardGoal').append(element);
        }else{

            element.className = "card_goal";
            element.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${goal.title}</h5>
                        <p class="card-text">${goal.description}</p>
                        <div style="color: red" id="goalProgress_${goal.id}">In Progress</div>
                        <div class="row">
                            <div class="main col-lg-4">
                                <small>${goal.timestamp}</small><br>
                            </div>
                            <div class="sidebar col-lg-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="True" id="changeGoalConcluded_${goal.id}" data-mdb-toggle="modal" data-mdb-target="#confirmModal_${goal.id}"/>
                                    <label class="form-check-label" for="changeGoalConcluded_${goal.id}">Finished</label>
                                    <div class="form-helper" id="changeGoalConcludedText_${goal.id}">Mark as Complete</div>
                                </div>
                            </div>
                        </div>
                        <small style="font-weight: bold;">Priority: ${goal.priority}</small><br>
                        <form action="{% url 'removeGoal' ${goal.id} %}"  method="POST">
                            <button type="button" class="btn btn-primary" data-mdb-toggle="modal" data-mdb-target="#editModal_${goal.id}">
                                Edit Description
                            </button>
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </div>
                </div>
            
                <div class="modal fade" id="confirmModal_${goal.id}" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="confirmLabel">Confirm Change</h5>
                                <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">Do you want to change the pending status of this goal?</div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal" onclick="checkCancel(${goal.id})">Cancel</button>
                                <button type="button" class="btn btn-primary" data-mdb-dismiss="modal" onclick="changeConcluded(${goal.id}, 2)">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="modal fade" id="editModal_${goal.id}" tabindex="-1" aria-labelledby="editGoalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <form action="{% url 'editGoal' ${goal.id} %}"  method="POST">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="editGoalLabel">${goal.title}</h5>
                                    <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="form-outline">
                                        <textarea class="form-control" name="modalEditContent" id="salveEdit_${goal.id}" rows="4" data-mdb-showcounter="true" maxlength="120">${goal.description}</textarea>
                                        <label class="form-label" for="salveEdit_${goal.id}">Description</label>
                                        <div class="form-helper"></div>
                                    </div><br>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary">Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>`;

            document.querySelector('#cardNewGoal').append(element);
        }

        document.getElementById("goalTitle").value = ""
        document.getElementById("goalDescription").value  = ""
        document.getElementById("goalConcluded").checked = false
        
    })
}

// Changes the completion status of a objectve to completed/in progress.
function changeGoalConcluded(id){

    const checkbox = document.getElementById(`changeGoalConcluded_${id}`);
    const isChecked = checkbox.checked;

    if (isChecked) {
        checkbox.value="True"
    } else {
        checkbox.value="False"
    }

    const changeId = id;
    const checked  = checkbox.value;
    let csrftoken = getCookie('csrftoken')
    
    fetch(`changeGoalConcluded/${changeId}`, {
        method: "POST",
        body: JSON.stringify({
            concluded: checked,
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .then(response => response.json())
    .then(goal => {

        if (goal.concluded == "True") {

            cardRemove = document.getElementById(`cardGoalPending_${goal.id}`);
            cardRemove.remove();

            const element = document.createElement('div');
            element.className = "card_Goal";
            element.innerHTML = `
                <div class="card" id="cardGoalPending_${goal.id}">
                <div class="card-body">
                    <h5 class="card-title">${goal.title}</h5>
                    <p class="card-text">${goal.description}</p>
                    <div style="color: green" id="progress_${goal.id}">Completed</div>
                    <small>${goal.goal_date}</small><br>
                    <small style="font-weight: bold;">Priority: ${goal.priority}</small><br>
                    <form action="{% url 'removeGoal' goal.id %}"  method="POST">
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </div>
            </div>`;

            document.querySelector('#cardGoal').append(element);
            document.querySelector('#no-comment').innerHTML="";
        } 
    })
}

