#FlexFlow 1.0

##General Architecture
Administrative and template data are retrieved when the site is first opened. When a user saves their budget profile, an empty budget is dynamically created based on the budget_template_category and budget_template_item tables.  

Users may return to this budget, but are not allowed to change the profile or budget dates.  Upon completion of the budget, the user is logged out, an email with a pdf attachment is sent to the user and cc'd to the planner, and the planner is sent an email with an attached csv file containing the user budget data.

Client budget items are not update per se, rather all items of a specific category (or category and month for flow items) are deleted and new values rows are inserted.

##Authorization
FlexFlow uses google firebase authorization and authentication.  Middleware intercepts all http calls to authenticate the current user.  The first time an user authenticates in FlexFlow, they are automatically inserted into the user table.  

For security reasons, neither the userID nor their budgetID are every returned to the front-end.

##Front End

###Views
Views make extensive use of modals to supply the user with feedback and hints as they make their way through the flexflow process.  In general, the flexflow process will follow a sequential process and each view will be visited only once.  If needed, however, the user is able to return to previously visited views to adjust or see budget items that were already entered.

The breadcrumbs are exposed as views are visited.  Any view already exposed as a breadcrumb, will not go away.

###Controllers
Controllers are intended to manage the interaction of data with public views.  No http calls will be found in controllers.  They also manage the status of the budget throughout its creation, as well as the breadcrumb menu.

###Factories
FlexFlow uses Angular 1 to manage front end routing.  All backend calls are located in factories:
* admin.factory.js - handles retrieval of administrative parameters for the front end (e.g. email address of planner)
* auth.factory.js - handles login, logout, authorization, and authstatechanges with google firebase authentication
* budget.factory.js - handles access of all budgeting data.  All calls require authentication.
* template.factory.js - handles retrieval of budget categories and items to build the budget template

##Back End

###Routes
* admin.js - returns administrative parameters
* client-report.js - creates client report pdf, sends as attachment to client, and deletes the pdf
* csv.js - creates budget data csv file, sends as attachment to planner, and deletes file
* item.js - CRUD for all client budget items
* private-data.js - returns user clearance based on authenticated email.  If user does not exist, they will be inserted into the user table
* profile.js - CRUD for client budget
* template.js - returns budget templates categories and items to create initial empty budget
* total.js - returns totals for each category

###modules
* decoder.js - uses google firebase authentication to obtain idtoken which includes name and email.  If authenticated, clientID and budgetID are retrieved and added to the token
* pg-config - contains database configuration information

### CSV and PDF Folders
Used as temporary holding when pdf and csv files are created at end of flexflow process.

### flexflow.sql
Contains SQL for creation of all tables.  Also includes a sample client "flexflowclient@gmail.com" with dummy data.
