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
docker build -t playground-prod .
```

To confirm that it worked, type `docker images` and you should see
`playground-prod` in the list of images under the `REPOSITORY` column, for example:

```
REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
playground-prod   latest    8c2439e40e81   1 hour ago      201MB
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
  --data-raw '{
    "code": "program hello\r\n  ! This is a comment line; it is ignored by the compiler\r\n  print *, 'Hello, World!'\r\nend program hello\r\n",
    "programInput": "",
    "libs" : []
}'
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
REACT_APP_PLAYGROUND_API_URL=http://localhost:5000 npm start
```

This should open the Fortran playground in your default web browser.
If not, navigate to http://localhost:3000 in your browser to start the
playground.

The `REACT_APP_PLAYGROUND_API_URL` must be set in the environment
(or, alternatively, in the `.env` file in the `frontend/` directory)
to the URL value of the Python backend server to use.
For example, if you're running the Python backend server locally in development
mode, set `REACT_APP_PLAYGROUND_API_URL` to `http://localhost:5000`.
If deploying to production, `REACT_APP_PLAYGROUND_API_URL` should be set to
`https://play-api.fortran-lang.org`.

## Deploying to production

This is a guide for deploying the Python backend to production.

### Set up the VM

This is a setup guide to host the server on AWS EC2.
It assumes you already have an account.
The steps may be somewhat different on other cloud providers.

1. Start the EC2 Launch Instance Wizard.
2. Select Ubuntu 22.04 LTS x86 as your OS under the AMI section.
2. Select the `t2.micro` instance if you want to stay within the free tier and
keep the configuration as default.
3. Select the amount storage you need; 20 GBs will suffice and will stay under
the free tier. Go to next step and leave tags as default.
4. Configure the security group to allow:
  * SSH on port 22;
  * HTTP on port 80;
  * HTTPS on port 443;
All ports should allow the source to be "Anywhere", i.e. 0.0.0.0/0.
5. Select or create your SSH key pair, and keep your private key safe.

Next, attach an Elastic IP to this instance so that the VM receives a static IP
address.

1. Select Elastic IP in the navigation panel, and create a new Elastic IP.
2. Associate this Elastic IP to the instance you've just created.
3. Go to your instance and note this Elastic IP
  (you'll see it listed under the v4 IP address).

### Connect to and prepare the VM

1. Locate your SSH private key file that you created or selected in step 5
and connect to your server by using SSH:
```
ssh -i <pem-file> ubuntu@<public-ip-address>
```
2.  Update your instance
```
sudo apt update
sudo apt upgrade
```
If prompted to reboot after the upgrade is complete, reboot the VM from the AWS
control panel and log back in to the VM using SSH as described in the previous
step.
3. Download [Caddy](https://caddyserver.com).
We will use Caddy as a reverse-proxy server in front of the Python server
as well as for the SSL certificate.
The downloaded file is a static binary program.
Make it executable (`chmod +x caddy`) and place it in a directory that is
meant for external programs, for example `/opt/caddy-2.5.2/bin` or similar.
This guide, and the
[reverse-proxy service file](systemd/playground-reverse-proxy.service)
assume that Caddy is executable and present in `/opt/caddy-2.5.2/bin`.
3. Follow the instructions from the [Getting started section](#getting-started)
to get the playground code, install Docker and the Python backend dependencies.
Before running the `pipenv install` step for the Python backend, make a
directory for the virtual environment using `mkdir .venv`.
This will allow us to run the production server directly from
`playground/backend/.venv/bin`.

### Create or update the DNS record

This guide assumes that the backend server of the Fortran Playground
will serve at the play-api.fortran-lang.org subdomain.
Regardless of whether this is the first deployment to production or not,
ensure that there is an A record for play-api.fortran-lang.org that
points to the public IP address of the VM.

### Start the backend server and reverse proxy

systemd service files for the Python backend server and reverse proxy
are provided in the playground/systemd directory.
To start and enable the services, type:

```
cd systemd
sudo ./initialize-services.sh
```

which will copy the service files to `/etc/systemd/system`,
start them, and enable them so they start on every boot.

## Reporting issues

Please report any issues or suggestions for improvement by opening a
[new GitHub issue](https://github.com/fortran-lang/playground/issues/new).
