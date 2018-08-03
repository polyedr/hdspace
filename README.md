## Setup

To run this code, you will need a modern version of PyCharm installed (Professional 2017.2 is preferred). You will also need next elements installed in your computer:

- Python 3.6
- Mongodb

Once you have done the above, you need to configurate PyCharm, with the follows properties:

- Create a Virtual Environment
- Install the neccesary python libraries.
- Add the Mongo Plugin and setup it.

Before run the Adevi project you should create the User, to do that you have to run userUnable file first with  userEnable() uncomment lines, you should add the 'UserSessions.sqlite' data base like Data Source (rigth click in 'UserSessions.sqlite' file and select the option As Data Source, then follow the steps).

FYI- This system use two different data bases to store the users, one in mongoDb calls 'user' and another one in SQLite calls 'UserSessions.sqlite'

If you have any question, please ask to the Adevi Team.