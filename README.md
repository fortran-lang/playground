# playground
An interactive Fortran playground

# Instructions to run

# Flask API
1. Install Docker
2. Build docker image (Switch to docker directory)
``` docker build -t playground-fpm .``` 
3. Install pipenv to manage packages 
```pip install pipenv```
4. Switch to backend directory and 
```pipenv install```
5. Run the flask server
```pipenv run flask run```

Example request:
`curl --location --request POST '127.0.0.1:5000/run' \ --header 'Content-Type: application/json' \ --data-raw '{ "code": "program hello\nprint *, \"Hello World New Line\"\nprint *, \"Hello Mars\"\nend program hello" } '`

# React frontend
Switch to frontend folder
1. Install node packages
```npm install``
2. Run the server
```npm start```

