This guide provides the basic steps to set up and run the Critter Keeper project locally and on the CISE servers. 
Expect to do some troubleshooting, but this document should help you get started. 

@@ MySQL databse @@

We will eventually have one centralized database, but for now, create your own database to work with.

1: Go to the CISE database registration page: https://register.cise.ufl.edu/
- Follow the instructions to set up a new database.

2: SSH Into the CISE Server: ssh your_cise_username@cise.ufl.edu

3: access mysql #: mysql -h mysql.cise.ufl.edu -u (your_username) -p

4: enter the password for the database you set up

5: Create Necessary Tables 

If you are using the backend, you will need at least the Persons table. Run the following SQL command in MySQL:

CREATE TABLE Persons (
    Personid INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Age INT NOT NULL,
    PRIMARY KEY (Personid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

## Please save all SQL commands you use to create tables so we can replicate them when we set up the shared database ##

6) Configure PHP to Connect to Your Database.
- Edit the db_config.php file in the backend
- Update the database username, password, and dbname

7) Update Backend & Frontend API Links
- Find all places in the frontend and backend where it says "REPLACE_LINK"
- there should be just two spots, one in api.js in the frontend, and one in test_frontend.php in the backend

replace "https://www.cise.ufl.edu/~samuel.stjean/Critter_Keeper/backend/api" with wherever you store your backend api file on your server. 

@@ Backend @@

SEE STEP 7 ABOVE !!

I highly recomend you pull this repo and put the php files on your own cise server to run the php with you db. 
I have no idea how you could run it locally so I dot recommend it. 

## Dont forget to reformat the php files for unix and have the permissions set to 755 ##

#: dos2unix *.php 
#: chmod 755 *.php

@@ Frontend @@

run it locally
(cise does not use node, we use react which wont need node when we put it on the server. for you to run it locally you will need node)

On your own computer:
# : cd frontend
# : npm install
# : npm start

@@ How to Contribute / Git Workflow @@ 

Create a New Branch:
# : git checkout -b feature-name

Make Changes & Commit:
#: git add .
#: git commit -m "Describe your changes"

Push Changes to GitHub:
#: git push origin feature-name

DO NOT PUSH TO MAIN, MAKE YOUR OWN BRANCH
