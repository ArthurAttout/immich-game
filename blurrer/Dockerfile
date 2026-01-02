FROM python:3

COPY ./requirements.txt /requirements.txt
COPY ./app.py /app.py
COPY ./blurrer.py /blurrer.py
RUN pip install -r requirements.txt

ENTRYPOINT ["python","/app.py"]