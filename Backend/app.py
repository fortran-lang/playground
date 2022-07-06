#importing dependencies - Flask for server and docker to communicate with docker API
from flask import Flask, jsonify, request
from flask_cors import CORS,cross_origin
import docker
import os
import tarfile

app = Flask(__name__)

cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

#Editing the file with code inside editor
def edit_file(code):
  Fortran_file = open('./File.f90','w+')
  Fortran_file.write(code)



#Copying file with fortran code to container
def copy_to(src, dst, container):
  dst = dst
  container = container

  os.chdir(os.path.dirname(src))
  srcname = os.path.basename(src)
  tar = tarfile.open(src + '.tar', mode='w')
  try:
    tar.add(srcname)
  finally:
    tar.close()

  data = open(src + '.tar', 'rb').read()
  container.put_archive(os.path.dirname(dst), data)


#Executing code inside container and getting it's output
def execute_code_in_container():
  client = docker.from_env()
  container = client.containers.run('newfort', tty=True,detach=True)
  copy_to('./File.f90', '/fortran/File.f90',container)
  container.exec_run('gfortran File.f90 -o executed_file.o',demux=True)
  a = container.exec_run('./executed_file.o')
  container.stop()
  return a
    

#API Endpoint to submit code
@app.route('/run', methods=['POST','GET','OPTIONS'])
@cross_origin()
def run_code():
  data = request.get_json()
  edit_file(data["code"])
  code_result = execute_code_in_container()
  output = jsonify({"executed" : code_result.output.decode()})
  return output, 202

if __name__ == '__main__':
  app.run(debug = True)

