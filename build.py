
import os, sys, shutil, configparser

EXCLUDE_FOLDERS = [".git", "static"]
BUILD_FOLDER_NAME = "build"


if len(sys.argv) > 1:
    folder_path = os.path.abspath(sys.argv[1])  
else:
    folder_path = os.path.abspath(os.getcwd())

if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
    print("Invalid path")
    exit()

build_folder_path = os.path.abspath(BUILD_FOLDER_NAME)

if os.path.exists(build_folder_path) and os.path.isdir(build_folder_path):
    shutil.rmtree(build_folder_path)

os.mkdir(build_folder_path)

with open("template.html", "r") as file:
    template_lines = file.readlines() 

for folder_name in os.listdir():
    if not os.path.isdir(folder_name) or folder_name in EXCLUDE_FOLDERS:
        continue

    config_file_path = os.path.join(folder_name, "config.ini")
    if not os.path.exists(config_file_path):
        continue

    with open(config_file_path, "r") as config_file:
        config = configparser.ConfigParser()
        config.read(config_file_path)
    config = config["DEFAULT"]

    content_name = config["content_name"] if "content_name" in config else folder_name
    content_title = config["content_title"] if "content_title" in config else folder_name

    # copy over js files 
    js_folder_path = os.path.join(build_folder_path, "js", folder_name)
    for file_name in os.listdir(folder_path):
        pass

    content_lines = []
    for template_line in template_lines:
        start_index = template_line.find("{{") 
        if start_index != -1:
            remaining = template_line[start_index:]
            end_index = remaining.find("}}")+2
            tag = remaining[2:end_index-2].strip().lower()
            if tag == "title":
                content_line = template_line[:start_index]+content_title+remaining[end_index:]
                content_lines.append(content_line)
        else:
            content_lines.append(template_line)

    content_file_name = f"{content_name}.html"
    content_file_path = os.path.join(build_folder_path, content_file_name)
    with open(content_file_path, "w") as content_file:
        content_file.writelines(content_lines)


    # print(content_file_path)
    # print(js_folder_path)