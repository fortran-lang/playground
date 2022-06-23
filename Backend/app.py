#importing dependencies - Flask for server and docker to communicate with docker API
from flask import Flask, jsonify, request
import docker

app = Flask(__name__)

#Editing the docker volume file with code
def edit_file(code):
  Fortran_file = open('\\\\wsl$\\docker-desktop-data\\data\\docker\\volumes\\Fortran\\_data\\Fortran.f90','w+')
  Fortran_file.write(code)

#Executing code inside container and getting it's output
def execute_code_in_container():
  client = docker.from_env()
  container = client.containers.run('sample', 'bin/bash -c "cd fortran; gfortran Fortran.f90 -o output.o; ./output.o"', volumes={'Fortran' : {'bind': '/fortran', 'mode':"rw"}},detach=True,remove=True)
  container_object = container.attach(stdout=True, stream=True,logs=True)

  for output in container_object:
    line = output
    return line

#API Endpoint to submit code
@app.route('/run', methods=['POST'])
def run_code():
  data = request.get_json()
  edit_file(data["code"])
  code_result = execute_code_in_container()
  output = {"output" : code_result.decode()}

  return jsonify(output)
