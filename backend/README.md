## Setup

To run this code, you will need a modern version of PyCharm installed (Professional 2017.2 is preferred). You will also need next elements installed in your computer:

- Python 3.6
- Mongodb

Once you have done the above, you need to configure PyCharm, with the following properties:

- Create a Virtual Environment
- Activate the Virtual Environment
- Install the neccesary python libraries.
- Run `pip install -e .` command
- Add the Mongo Plugin and setup it.

Before run the Adevi project you should create the User, to do that you have to run userUnable file first with  user_enable() uncomment lines, you should add the 'UserSessions.sqlite' data base like Data Source (rigth click in 'UserSessions.sqlite' file and select the option As Data Source, then follow the steps).

FYI- This system use two different data bases to store the users, one in mongoDb calls 'user' and another one in SQLite calls 'UserSessions.sqlite'

If you have any question, please ask to the Adevi Team.