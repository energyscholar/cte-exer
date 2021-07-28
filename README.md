# cte-exer
CTE Exercise for Bruce 

The Assignment should be done using Free Tier AWS resources.
all the source code (including build/deployement scripts) you produce for the assignment should be checked in and made available to us on the source management system of your choice (Github,Bitbucket, Gitlab, Code Commit).

The assignment is to build a small very simple CRUD web application using NodeJS, Express, Passport auth and a database backend of your choice.  The application should be deployed in a Docker Container on a free tier AWS ubuntu instance.

The application must support
1) a user signup (email/firstname/lastname)
2) user login (email as login id)
3) user able to  record a blood pressure reading (systolic, diastolic, hr)
4) user list past readings.

Bonus is to use either Google or Facebook options for user signup/login.

***********************************************************************************
Bruce's comments:

When complete we will review the application function and source code/deployment scripts by running the application and by reviewing the source code. As I previously indicated, application styling/ui will not be evaluated other than from a functional standpoint.

All the source code/ip you write for this assignment is your property and you grant CTE the right to review and exercise it.

As of 28 July 2021 this is deployed to AWS EC2 server (Ubuntu) at http://3.84.203.16:3000/

Note that this app is NOT running with HTTPS, only HTTP, so it's hopeless insecure.  
