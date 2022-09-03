# The Fortran Playground

This is an interactive Fortran playground in the browser.
It's main purpose is for newcomers to easily get a taste for the language
and learn the essentials of Fortran programming.

Follow the instructions below if you want to run the Fortran Playground server
on your own computer.

## Getting started

### Get the code

```
git clone https://github.com/fortran-lang/playground
cd playground
```

### Install dependencies

The key dependencies for the Fortran playground are:

* [Python](https://www.python.org/) for the backend server;
* [Docker](https://www.docker.com/) for the container on the backend server;
* [Node.js](https://nodejs.org/) for the frontend server.

Ensure these are installed on your system before proceeding.

### Set up the backend server

#### Build the Docker image

The Fortran playground relies on a Docker container in which the backend server
runs the compiler and executes the code.
For the playground to work, we need to be able to run `docker` as a non-root
user, that is, without `sudo`.
See the [additional configuration instructions](https://docs.docker.com/engine/install/linux-postinstall/)
for how to do that on Linux.

When ready, type:

```
cd backend/Docker
docker build -t playground-f .
```

To confirm that it worked, type `docker images` and you should see
`playground-f` in the list of images under the `REPOSITORY` column, for example:

```
REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
playground-f   latest    8c2439e40e81   1 hour ago      201MB
```

Now move one directory up where we will set up the Python environment and the
required libraries:

```
cd ..
```

#### Install the Python libraries

The Python backend server and the packages that it depends on are managed using
pipenv.
If you don't have pipenv installed, you can install it using pip:

```
pip install --user pipenv
```

Or, if you don't have pip, use your OS's preferred package manager to install
it.
You can learn more about pipenv [here](https://pipenv.pypa.io/en/latest/).

When ready, type:

```
pipenv install
```

#### Run the backend server

To run the development server (Flask), type:

```
pipenv run flask run
```

While running, you can try to make an example HTTP request to the server from
another terminal window using `curl`:

```
curl \
  --location \
  --request POST '127.0.0.1:5000/run' \
  --header 'Content-Type: application/json' \
  --data-raw '{"code": "program hello\nprint *, \"Hello World New Line\"\nprint *, \"Hello Mars\"\nend program hello", "programInput": "", "libs": ""}'
```

If everything is set up correctly so far, you should get the following response:

```
{"executed":" Hello World New Line\n Hello Mars\n"}
```

### Set up the frontend server

From the top-level directory of the Fortran playground, navigate to the
frontend directory:

```
cd frontend
```

To install the Node.js dependencies, type:

```
npm install
```

Run the server by typing:

```
npm start
```

This should open the Fortran playground in your default web browser.
If not, navigate to http://localhost:3000 in your browser to start the
playground.

## Reporting issues

Please report any issues or suggestions for improvement by opening a
[new GitHub issue](https://github.com/fortran-lang/playground/issues/new).
