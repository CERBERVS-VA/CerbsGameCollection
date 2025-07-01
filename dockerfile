FROM python:3.13-alpine

COPY . /app
WORKDIR /app 

RUN apk update && \ 
    apk upgrade
RUN pip install -r requirements.txt

EXPOSE 8000

ENTRYPOINT ["python", "start_server.py"]
