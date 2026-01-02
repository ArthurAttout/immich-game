import concurrent.futures
from flask import request
from flask import Flask
from flask import jsonify
from flask import Response
from flask import send_file
import os.path
from blurrer import Blurrer
import uuid
from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://sys.stdout',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = Flask(__name__)
executor = concurrent.futures.ThreadPoolExecutor(max_workers=5)
blurrer = Blurrer()
jobs = {}

def job_done(job, job_id, logger):
    if job.done():  
      logger.info(f'{job_id} finished : {job.done()}')
    if job.exception():
      logger.error(f'{job_id} shat the bed : {job.exception()}')

@app.route('/jobs/submit', methods=['POST'])
def submit_job():
    job_id = str(uuid.uuid4())
    asset_id = request.json['asset_id']
    app.logger.info(f'Created new job {job_id} for asset {asset_id}')
    response = {"job_id":job_id}

    job = executor.submit(blurrer.blur, asset_id, job_id, app.logger)

    def job_done_with_id(thejob):
        job_done(thejob, job_id, app.logger)

    job.add_done_callback(job_done_with_id)
    return jsonify(response)

@app.route('/jobs/<uuid:job_id>')
def get_job(job_id):
    app.logger.info(f'Returning status for job {job_id}')
    filepath = f'{str(job_id)}.png'
    if not(os.path.isfile(filepath)):
       return Response('Job not finished or not started', status=400, mimetype='application/text')
    
    return send_file(filepath, mimetype='img/png')

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9001)
    