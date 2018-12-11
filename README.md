# Log Parser

By: Nikolaus Zufall

Used to parse log files into an empty database
ReadMe for server can be found in fps-logs-server

To use:
1. Have desire JSON files in directory
2. Run the following command:
``` 
python log_parser.py FILEPATH

#Example
python log_parser.py fps_logs
```
Note: Results are output into FPS_LOGS.DB

### Libraries Used:
* OS.listdir - to get all files in a directory
* JSON - to properly handle JSON files
* SYS - to get commandline arg for file path
* SQLite3 - to have a database to store data into

### References:
* https://docs.python.org/3/tutorial/errors.html
* https://docs.python.org/2/library/sqlite3.html
* https://www.sqlite.org/datatype3.html
* https://docs.python.org/3/tutorial/classes.html
* https://stackoverflow.com/questions/23770480/sqlite-table-and-column-name-requirements
* https://www.geeksforgeeks.org/class-method-vs-static-method-python/
* https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_google.html