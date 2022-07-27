# importing dependencies - Flask for server and docker to communicate with docker API
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import docker
import os
import tarfile

app = Flask(__name__)

cors = CORS(app)

app.config["CORS_HEADERS"] = "Content-Type"

# Starting container
client = docker.from_env()
container = client.containers.run("playground-small", tty=True, detach=True)

# Editing the file with code inside editor
def edit_file(code, input=""):
    Fortran_file = open("./File.f90", "w+")
    Fortran_file.write(code)
    program_input = open("./program_input.txt", "w+")
    program_input.write(input)


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
    copy_to("./File.f90", "/fortran/File.f90", container)
    copy_to("./program_input.txt", "/fortran/program_input.txt", container)
    executable = container.exec_run(
        "gfortran File.f90 -o executed_file.o", demux=True
    )
    if executable.exit_code == 0:
        a = container.exec_run(
            'sh -c "cat program_input.txt | ./executed_file.o"', demux=True
        )
    else:
        a = executable
    return a


# API Endpoint to submit code
@app.route("/run", methods=["POST", "GET", "OPTIONS"])
@cross_origin()
def run_code():
    data = request.get_json()
    edit_file(data["code"], data["programInput"])
    code_result = execute_code_in_container()
    if code_result.exit_code == 0:
        print(code_result.output[0].decode())
        output = jsonify({"executed": code_result.output[0].decode()})
    else:
        print(code_result.output[1].decode())
        output = jsonify({"executed": code_result.output[1].decode()})

    return output, 202


if __name__ == "__main__":
    app.run(debug=True)
