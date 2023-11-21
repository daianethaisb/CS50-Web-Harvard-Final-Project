
![](Aspose.Words.2eba9dbb-0d2f-45c0-8098-99d6d12b102b.001.png)![](Aspose.Words.2eba9dbb-0d2f-45c0-8098-99d6d12b102b.002.png)

**Planner Web**

In this project, I have developed a personal management system. The purpose of this system is to help organize and plan processes such as: controlling finances, studying and committing to personal goals. It is worth mentioning that each user has sole and exclusive access to their own records. 

**Features**

The functionalities of this system are presented through a structure with the following pages:

- Login, logout and registration page.
- Header page: On all access pages within the system, for a logged-in user, you can see the header. There, the user can return to the home screen at any time by clicking on the system name or logo, as well as a greeting bearing the user's name and a logout button.
- All the images used in the application (logo and illustrative images in each of the management options) are my own work.
- Home Page: On the home page, the user is shown the options available for management: finances, studies and goals. A calendar can also be displayed, showing the current date. All management cards have the date/time of the last movement applied.
- Finance management page: contains all registered finances. This page offers the user the following options:
  - Finance data records separated by category: all, incoming only, outgoing only, pending.
  - In any of the categories you can edit the description of the finance.
  - In any of the categories you can change the status of the finance to closed/pending.
  - You can delete a record in any of the categories.
  - Search bar to find records by title.
  - Button to return to the homepage.
  - Data pagination from 6 records.
- Study management page: on this page the user can register and keep track of their courses/studies. This page offers the following options:
  - Record of all courses in progress or completed.
  - In each course record, separately, the user can include annotations.
  - At any time, a user can change the status of a study card to in progress/completed.
  - A user can delete a record at any time.
  - Search bar to find records by title.
  - Button to return to the homepage.
  - Data pagination from 6 records.
- Objectives management page: on this page the user can register and monitor their goals and objectives. This page offers the following options:
  - Display of a list of objectives in progress.
  - Display of a list of the last completed objectives.
  - The user can edit the description of an objective in progress.
  - You can mark an ongoing goal as completed.
  - A user can delete a record at any time.
  - Button to return to the homepage.
  - Data pagination from 4 records.

**Distinction and Complexity**

In terms of distinction, this system stands out from the others due to its complexity and the entire integration structure between the technologies used throughout the course. The system I named *Planner* came from an idea that combined learning with the development of a relevant system that could be applied to routine management. When I thought about choosing my idea, I imagined myself as a user and tried to find something that could be executed in a simple and objective way, resulting in a system that was intuitive and easy to use. 

I tried to develop this system in such a way that I could use all the skills and knowledge I acquired during the classes and apply as many of the technologies presented in the course as possible in an extremely fruitful way, perfecting everything I learned while applying all the teachings in a practical way. 

In terms of complexity, my goal was to use all the tools and teachings developed during the course, in order to execute all the appropriate and necessary functionalities in a clear and functional way. 

As requested, the communication between back and front end was handled by the Django Framework, structured with Python. The visual part of the project uses Bootstrap tools, promoting a modern and beautiful design. 

Also on the front-end, the following technologies were applied: Javascript - to enhance the use of other tools and improve the usability of the user interacting dynamically, HTML and CSS (SAASS - exploiting its extremely relevant features and making the code even clearer). Finally, the system also makes use of React and features a pleasant calendar on the home screen. The system is fully responsive to mobile screens.

**Files and directories**

**planner** - main directory of the ***Planner* app**

- ` `static / planner - contains all static files.
  - image - contains all the images created by me to illustrate the options available on the home screen, as well as the logo developed for the project.
  - planner.js - file containing the entire set of JavaScript functions executed during system execution to manipulate the DOM and interact with the Django front-end framework for data management.
  - app.js - React component used on the home screen.
  - styles.scss - project style.
- templates - stores all HTML files.
- models - user data models: *User, Finance, Study, Goal and Comment*.
- urls.py - Contains all the URL paths for running the system, as well as login and logout.
- views.py - Contains all the visualization functions for authenticating and manipulating user data.

**How to run the application**

- Run the migrations with the command python manage.py makemigrations.
- Apply migrations with the python [manage.py](http://manage.py/) migrate command.
- Run the server using python [manage.py](http://manage.py/) runserver.

