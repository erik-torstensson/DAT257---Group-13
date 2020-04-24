
**Summary of week 3 (first week of team reflections)**

This week focus has been put on extending our website with functions regarding the use of a calendar and a map. A basic website containing and handling the basic function was already built before week 3. This website at the start of week 1 was able to take string inputs, compare these with data from Gothenburg city and then return and print the relevant answers for when the input street will be cleaned.

During Friday we held a meeting with representatives Lisa and Jonas from Parkering Göteborg, where we were able to ask questions pertaining to what kind of solutions the company is currently working on. We were informed that they are facing a challenge with paid parking zones, where users would like a feature that disables the ability to activate a parking card in a zone where parking is currently prohibited. As of right now, this is still possible and it seems that the solution is quite tricky. Certain larger parking zones are difficult to handle, since they can for example include snippets of smaller backstreets, which can cause confusion and unwanted parking violations.

This seemed very interesting to tackle, but it would mean that our current backend would have to be reworked. We would have to dive deep into the parking app that Parkering Göteborg supplies. However, instead of doing this, Lisa and Jonas had an idea where we could shift our focus to residential parking and create a standalone application. This application would alert residents when parking is prohibited in their area, and could be molded from our current backend. Instead of relying on parking signs a user could easily be notified whenever their street is scheduled for cleaning. During our group meeting next monday, we will discuss this idea further.

---

**Customer Value and Scope**

The scope to help citizens of Gothenburg to avoid tickets from parkinging cleaning zones is still relevant. The features that were first implemented was handling user input and open data. These were prioritized since they gave us an easy way to demo our idea after as well as a good groundwork to continue refining and working on. This week's features of calendar and google map integration were prioritized for different reasons. A calendar function was always a clear request from the external stakeholder and is seen as a way to make our application significantly more useful and user friendly. The Google map integration also helps visualize to users that the correct street has been selected and is important since future features will use the map and extend it will further features. Features like where alternative parking is available nearby and an easier way to interact with the application through map instead of typing a string are both expected to extend the google map feature. 

The group has not declared an official success criteria yet apart from delivery of the application under development. Learning and experience was brought up in early meetings and is something the group expects. To guarantee the expectations are met the group should take writing down and exemplifying the expectations into consideration. 

The user stories are developed with I.N.V.E.S.T. in mind and the intention is to break down the stories to easy tasks. This has worked successfully this far but some problems with the stories sometimes not following the literature provided in the course. In the future the group needs to make sure new user stories are fully thought through and easy to break down into manageable tasks. 

Acceptance tests after the sprint have not been done yet. But after the first sprint we have the ambition to create a structure for one, but before doing that we would like to discuss this with our external stakeholder and teaching assistant. 
Our KPIs to measure progress are velocity, team stress levels and one yet undefined Kpi to measure quality. These were not used in the beginning of week 3’s planning on the amount of work, this is because at that time they were not yet defined properly and we found it hard to quantify them. We are hoping and planning on using them starting at week 2, by then we have one weeks experience of working in this format. We hope this will clarify how to appraise the KPIs in the planning phase and start using them formally from there. 

---

**Social Contract and Effort**

We created a social contract the first week and submitted it to our repo. The social contract was then considered a work in progress and included means of communicating, programming language and more. If the group members or if the supervisor deems changes necessary we will expand the contract. So far no changes have been put forward but it is something the group should bring up in the next meeting with the supervisor or in internal meetings.

The combined effort has so far been manageable but thus far not recorded in any way. Since the features implemented were relatively basic this was not a problem but going forward the effort is probably going to be increased. To manage this we will need to implement KPIs regarding effort and/or stress as well as start keeping track of effort. This will hopefully keep us from becoming exhausted and stressed over to high effort.

---

**Design decisions and product structure**

Since the start of the sprint, we have focused mainly on functionality of the application. Our documentation is rather lacking and mostly consists of our comments and progress on our Scrum board. Each vital part of the code has been commented in a way that is easy to understand. The code is currently decently indented and easy to read, but cleaning might be needed in the future.

We should consider continuously updating a document of our progress.

The choice of using APIs supplied by Google was motivated by the fact that they  are such commonly used tools and very easy to work with. It also makes sense, since the Google calendar, for example, is a widely used application that is compatible with multiple different platforms.

---

**Application of Scrum**

Since this was our first sprint we did not have clear roles throughout the sprint. The tasks were distributed based on everyone’s expertis. We think that we should have more clear roles, such as scrum master etc. This helps keeping the project structured and held to the deadline. 

We have structured the work after the agile practise to work both incrementally and focus on the most value adding features. This was performed by listening to the external stakeholder and prioritizing what features they deem most important. After this we choose to work incrementally. We choose small parts of the entire application and break those down into individual features, which are later broken down further into tasks. These tasks are then chosen each week to work on and to quickly produce an acceptable result that can be evaluated and then more on to the next task.

The product owner of our project is Kim Lantto who is an employee in Gothenburg city. 

We are currently using Trello as our scrum board. Trello offers an easy to organize board. We have used its features to easily distribute the tasks and organize our user stories. 

We are also using GitHub as a platform to have the project on. Since we can create different branches for different features, we can work more efficiently simountansly. 

Glitch is also another tool to code simultaneously. It provides a live feed back when coding. We use it also as a host for the website.
