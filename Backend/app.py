# importing dependencies - Flask for server and docker to communicate with docker API
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import docker
import os
import tarfile
import yaml
import json
app = Flask(__name__)

cors = CORS(app)

app.config["CORS_HEADERS"] = "Content-Type"

# Starting container
client = docker.from_env()
container = client.containers.run("playground-fpm", tty=True, detach=True, network_disabled=True, mem_limit="16g")

#Converting tutorial YAML
with open('tutorial.yml', 'r') as file:
    configuration = yaml.safe_load(file)

with open('../frontend/src/tutorial.json', 'w+') as json_file:
    json.dump(configuration, json_file)


# Editing the file with code inside editor
def edit_file(code, input=""):
    Fortran_file = open("./main.f90", "w+")
    Fortran_file.write(code)
    Fortran_file.close()
    program_input = open("./program_input.txt", "w+")
    program_input.write(input)
    program_input.close()

# Copying file with fortran code to container
def copy_to(src, dst, container):
    dst = dst
    container = container

    os.chdir(os.path.dirname(src))
    srcname = os.path.basename(src)
    tar = tarfile.open(src + ".tar", mode="w")
    try:
        tar.add(srcname)
    finally:
        tar.close()

    data = open(src + ".tar", "rb").read()
    container.put_archive(os.path.dirname(dst), data)


# Executing code inside container and getting it's output
def execute_code_in_container():
    copy_to('./main.f90', '/fortran/playground/app/main.f90', container)
    copy_to('./program_input.txt', '/fortran/playground/program_input.txt', container)

    container.exec_run('sh -c "/fortran/fpm-0.6.0-linux-x86_64 build"')
    a = container.exec_run('sh -c "cat program_input.txt | timeout 15s /fortran/fpm-0.6.0-linux-x86_64 run"',demux=True)

    return a


# API Endpoint to submit code
@app.route("/run", methods=["POST", "GET", "OPTIONS"])
@cross_origin()
def run_code():
    data = request.get_json()
    edit_file(data["code"], data["programInput"])
    code_result = execute_code_in_container()
    if code_result.output[0] == None:
        output = jsonify({"executed": ""})
        return output, 202
    output = jsonify({"executed": code_result.output[0].decode()})
    

    return output, 202


if __name__ == "__main__":
    app.run(debug=True)
