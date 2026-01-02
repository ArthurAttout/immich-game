from PIL import ImageDraw
from PIL import ImageFilter
import requests
import sys
from PIL import Image
from io import BytesIO
import os

token = os.environ['IMMICH_TOKEN']
host = os.environ['IMMICH_HOST']
headers = {'x-api-key':token}

class Blurrer:
  def blur(self, asset_id, job_id, logger):
    logger.info(f'Start blurring asset {asset_id}')
    data = {}

    metadata = requests.get(f'{host}/api/assets/{asset_id}/', headers=headers)
    if not(metadata.ok) or metadata.status_code != 200:
      logger.error(f'Metadata request for asset {asset_id} failed : {metadata.status_code}')
      return
    
    if len(metadata.json()['people']) == 0:
      logger.warning(f'Asset {asset_id} has no faces in it')
      return
    
    for person in metadata.json()['people']:
      name = person['name']
      if len(person['faces']) == 0:
        continue

      face = person['faces'][0]
      box_x1 = face['boundingBoxX1']
      box_x2 = face['boundingBoxX2']
      box_y1 = face['boundingBoxY1']
      box_y2 = face['boundingBoxY2']
      data[name] = [box_x1, box_x2, box_y1, box_y2]

    
    logger.info(f'{len(data)} faces found in asset {asset_id}')
    img = requests.get(f'{host}/api/assets/{asset_id}/original', headers=headers, stream=True)

    logger.info(f'Original asset request status code : {img.status_code}')
    if not(img.ok) or img.status_code != 200:
      logger.error(f'Original asset request for asset {asset_id} failed : {img.status_code}')
      return -1

    img = Image.open(BytesIO(img.content))

    # Source - https://stackoverflow.com/q/56987112
    # Posted by Otor
    # Retrieved 2025-12-15, License - CC BY-SA 4.0

    # Create rectangle mask
    mask = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(mask)

    for person in data:
      face = data[person]
      draw.rectangle([ (face[0],face[2]), (face[1]+50,face[3]+50) ], fill=255)

    # Blur image
    blurred = img.filter(ImageFilter.GaussianBlur(52))

    # Paste blurred region and save result
    img.paste(blurred, mask=mask)
    img.save(f'{job_id}.png')
    logger.info(f'Saved blurred asset to file {job_id}.png')
