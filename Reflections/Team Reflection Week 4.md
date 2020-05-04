**Summary of week 4 (second week of team reflection)**


During the fourth week, we have been able to pinpoint the desired end result of our project. The application will be tailored to users who desire a notification system that informs them of the current status of a certain residential parking zone. If a parking zone where the user currently has their car parked is due for cleaning, the user should be alerted and given choices of alternate parking spots within a certain radius. The user will be able to add cleaning schedules for parking zones to a calendar of their choice (Google, Outlook etc.). A user should also be able to search for specific parking zones to check if parking is allowed or prohibited (and for how long).
 
We have remodeled our backend to suit these planned features and have been working on implementing some of them.
 
During the teacher/TA supervision session we had the chance to discuss our current progress and our methods. We were advised to focus more on our agile work method. Make more use of our KPIs and utilize them for a more efficient workflow.
 
A Meeting with Kim Lantto was held at the end of week 4 where the demo in its current state was shown and we received feedback. It was a positive reaction from Kim overall of the current progress, but he still had some requests for future features. Namely how the map is going to be utilized and how to best visualise parking availability for end users without confusing them. Features like color codes, limiting the amount of unnecessary information shown etc. He also suggested that the team should be divided into specialized roles, one should focus almost exclusively on front-end, one on visualisation etc. We felt that it was too early to make such decisions this early in development, when we still have a lot of back-end and other figuring out to do. 
 
 ---
 
**Customer Value and Scope**

At the end of last week we changed scope from “all parking citizens in Gothenburg”, to “all residential parking citizens”. This made us change and add some user stories. Some new back end solutions were then prioritized, since it was crucial to create value for the stakeholders. 

This sprint did not include the velocity KPI but to make sure the workload will not get out of hand and to evaluate our effort we need to award a measurement of effort to our tasks when planning the next sprint. This will be implemented in the coming sprint.
Our stress levels have been pretty uniform and equal during the sprints. We think this is a good KPI for our team. If somebody feels stressed, we can help out. It’s also good for evaluating tasks, if they are too small or too big.
 
 ---
 
**Design decisions and product structure**

We decided to implement color coding to show the availability of the parking spaces to meet the stakeholders request of easy use and accessibility. This worked out great and to always make sure we design our application after the wants and needs of the stakeholder we need to be perceptive in understanding what to do. We also noticed during the sprint that we needed to implement an API for swedish holidays in order to deliver the service we wanted to deliver. 

In compliance with last week's reflection we are documenting our meetings in text documents and documenting our sprint progress in a scrum board. So far this has worked out fine but we might need to reflect and reevaluate this as the project goes further along. The text documents are curated and updated by the scrum master while the scrum board is updated by anyone in the group.

We have discussed how we can improve our complexity. We are not yet sure how we should do this, but we talked about saving data in a database instead of doing API calls each time the website is loaded. We also have some quadratic complexity when searching and comparing different lists (cleaningZones and residentialParkings), which maybe will be solved with a hashTable/Map to find indices with a constant complexity.

The project is a website where HTML, CSS, and JavaScript are mainly being used. We have ensured that our code is in the proper file so different kinds of code don’t get mixed. This ensures that the product is easier to maintain and find bugs. We have implemented some APIs and ensured that the code is used according to the API owner’s instructions, such as Google Maps API.
 
 ---
 
**Application of Scrum**

During last week's supervision meeting we came to a conclusion that we needed to bring more structure to our meetings and our work overall in order to streamline the meetings but also help eachother out more. We implemented a weekly rotation of a scrum master who has the responsibility of the meetings during the week. That includes providing an agenda for the meeting, leading the meeting and making sure that everyone that has something to say about a topic has a chance to do so.

Stand up meeting: After last week’s first meeting we felt the need of having a stand up meeting to ensure that progress is being made. Since we distributed the task on the first meeting a stand up meeting made sure that all members are making progress with their tasks, and if not the problems are brought up and discussed in small groups. This has left a positive impact on our work since it made all members stick more to the time frame of the sprint and that the tasks were done in time.
