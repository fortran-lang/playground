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
npm start
```

This should open the Fortran playground in your default web browser.
If not, navigate to http://localhost:3000 in your browser to start the
playground.

## Reporting issues

Please report any issues or suggestions for improvement by opening a
[new GitHub issue](https://github.com/fortran-lang/playground/issues/new).

## Production Guide
This is a setup guide to host the server on AWS EC2. It's assuming you already have an account setup and know about free tier limitations.
#### Setting up EC2 
1.  Select the EC2 Launch Instance Wizard choose Ubuntu(22.04 x86) as your OS under AMI section. 
2. Choose t2.micro instance if you want to stay within free tier or your preferred instance type and head to  the next section.  Keep configuration as default.
3.  Select the storage you need, 20 GBs should be more than enough and it'll still stay under free tier. Go to next step and leave tags as default.
4. Configure the security group as follows:
![security group](https://imgur.com/a/zGTCN6F)
5.  Click next to choose your key pair.(You'll be connecting to SSH via this key so keep it safe, if you don't have one already generate a new one)

Now, we need to attach an Elastic IP to this instance, as instances are allocated only a dynamic IP, also free tier only allows 1 hour of use without  an elastic IP. 

1. Select Elastic IP in the navigation pane, and generate a new Elastic IP.
2. Associate this Elastic IP to the instance you've just created.
3. Go to your instance and copy this Elastic IP(you'll see it listed under the v4 IP address)

#### Setting up the EC2 instance
1. Locate your key.pem file you generated in step 5 and connect to your server by using SSH:
```
sudo ssh -i <pem file> ubuntu@<Public IP of the EC2 instance>
```
2.  Update your instance
```sudo apt-get update```
3.  Install pip
```sudo apt install python3-pip```
4.  Install nginx
`sudo apt-get install nginx`
5 Install node.js and npm using nvm.
Get NVM
``curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
``
Activate nvm
`. ~/.nvm/nvm.sh`
Install node
`nvm install --lts`

####  Setting up the playground on VM
1.  Clone the repository
`git clone https://github.com/fortran-lang/playground.git`
2.  Assign all read and write permissions to the project directory
```sudo chmod 777 playground```
```cd playground```
3.  Go to frontend directory`cd playground/frontend`, before we build a production version we need to replace our API calls with the public IP.
	a. Open App.js file which has our API call:
	`sudo nano playground/frontend/src/App.js`
	b. Replace the http://127.0.0.1:5000 url with http://{your public ip}:5000

4. Install modules `npm install`, create a build from those modules `npm run build`
4. Create a directory for the frontend with the following command:
`sudo mkdir /var/www/html/react`
Next, copy all contents from the build directory to the react directory:
`sudo cp -r /home/ubuntu/playground/frontend/build/* /var/www/html/react/`

5.  To go on, set proper ownership of the react directory with the following command:
`sudo chown -R www-data:www-data /var/www/html/react`
6. Next, create an Nginx virtual host configuration file to host your React app.
`nano /etc/nginx/conf.d/react.conf`
add this to the file:
`server {
         listen 80;
         listen [::]:80;
         root /var/www/html/react/;
         index index.html index.htm;
         # MODIFY SERVER_NAME EXAMPLE
         location / {
              try_files $uri $uri/ =404;
         }
}`
7. Restart nginx
`systemctl restart nginx`

####Setting up Docker
Refer this link for [setting up docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository "setting up docker") (setup via repository).
After successfully installing docker switch to the Docker directory `cd playground/backend/docker`
and build the docker image `sudo docker build -t playground-prod .` .

#### Setting up the backend server
1.  Go to the backend folder `cd playground/backend`.
2. Install pipenv to install packages from the pipfile
  `sudo pip install pipenv`
3. Make a directory for virtual environment(this will be useful when setting up the service) using `mkdir .venv` and install all required modules using `pipenv install` 
4. Start the server using:
```sudo pipenv run gunicorn --bind 0.0.0.0:5000 wsgi:app```

You'll now be able to use the app. You should also setup a service for the gunicorn server so that it starts automatically when the server boots. 

#### Setting up the service
1. Create a service file for our app `sudo nano /etc/systemd/system/backend.service`
2. Write the following configuration: 
```
[Unit]
Description=Gunicorn instance to serve backend for playground
After=network.target
[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/playground/backend
Environment="PATH=/home/ubuntu/playground/backend/.venv/bin"
ExecStart=sudo /home/ubuntu/playground/backend/.venv/bin/gunicorn --workers 3 -b :5000 wsgi:app
[Install]
WantedBy=multi-user.target
```
Press Ctrl + X and save the file.
3. Start the service using `sudo systemctl start backend`
4. Then enable it so that it starts at boot:
  `sudo systemctl enable myproject`

Now, You'll can directly cater requests to the port and your app should work. I recommend using a 
reverse proxy for your requests by altering the nginx configuration and adding an endpoint
for the API.